import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = 1; // Placeholder for demonstration. Replace with actual authenticated user ID.

    const data = await request.json();
    console.log('Received data from Python backend:', JSON.stringify(data, null, 2));

    const {
      file_name,
      month,
      year,
      directorate_name,
      sheet_number_processed,
      processed_data
    } = data;

    // Start a Prisma transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Find or Create Directorate
      let directorate = await tx.directorate.findUnique({
        where: { name: directorate_name },
      });

      if (!directorate) {
        directorate = await tx.directorate.create({
          data: { name: directorate_name },
        });
      }

      // 2. Find or Create Office (using default office for now)
      let office = await tx.office.findFirst({
        where: { directorate_id: directorate.directorate_id }
      });

      if (!office) {
        office = await tx.office.create({
          data: {
            name: 'Default Office',
            directorate_id: directorate.directorate_id
          }
        });
      }

      // 3. Process and Insert Transactions based on sheet type
      if (sheet_number_processed === 1) {
        // Hierarchical Data (Revenue/Use types)
        const { chapters, sections, items, types } = processed_data;

        // Helper function to find or create hierarchical entities
        const findOrCreateChapter = async (chapterId: string, name: string) => {
          let chapter = await tx.chapter.findUnique({ where: { chapter_id: chapterId } });
          if (!chapter) {
            chapter = await tx.chapter.create({ data: { chapter_id: chapterId, name } });
          }
          return chapter;
        };

        const findOrCreateSection = async (sectionId: string, name: string, chapterId: string) => {
          let section = await tx.section.findUnique({ where: { section_id: sectionId } });
          if (!section) {
            section = await tx.section.create({ 
              data: { section_id: sectionId, name, chapter_id: chapterId } 
            });
          }
          return section;
        };

        const findOrCreateItem = async (itemId: string, name: string, sectionId: string) => {
          let item = await tx.item.findUnique({ where: { item_id: itemId } });
          if (!item) {
            item = await tx.item.create({ 
              data: { item_id: itemId, name, section_id: sectionId } 
            });
          }
          return item;
        };

        const findOrCreateType = async (typeId: string, name: string, itemId: string) => {
          let type = await tx.type.findUnique({ where: { type_id: typeId } });
          if (!type) {
            type = await tx.type.create({ 
              data: { type_id: typeId, name, item_id: itemId } 
          });
        }
          return type;
        };

        // Process Types (these are the actual financial transactions)
        for (const typeData of types) {
          if (parseFloat(typeData.value) > 0) {
            // Extract hierarchy IDs from type ID
            const typeIdParts = typeData.id.split('_');
            const chapterId = typeIdParts[0] + '_' + typeIdParts[1];
            const sectionId = typeIdParts[0] + '_' + typeIdParts[1] + typeIdParts[2];
            const itemId = typeIdParts.slice(0, -1).join('_');

            // Ensure hierarchy exists
            await findOrCreateChapter(chapterId, `Chapter ${chapterId}`);
            await findOrCreateSection(sectionId, `Section ${sectionId}`, chapterId);
            await findOrCreateItem(itemId, `Item ${itemId}`, sectionId);
            const type = await findOrCreateType(typeData.id, typeData.name, itemId);

            // Create transaction
            await tx.transaction.create({
            data: {
                office_id: office.office_id,
                directorate_id: directorate.directorate_id,
                account_id: 1, // 1 for revenue, 2 for use (determine based on chapter prefix)
                type_id: type.type_id,
                item_id: itemId,
                section_id: sectionId,
                chapter_id: chapterId,
                amount: parseFloat(typeData.value),
                date: new Date(parseInt(year), parseInt(month) - 1, 1), // First day of the month
            },
          });
          }
        }
      } else if (sheet_number_processed === 2) {
        // Financial Accounts Data (Debit/Credit)
        const financialAccounts = processed_data;

        for (const mainCategory in financialAccounts) {
          for (const subCategory in financialAccounts[mainCategory]) {
            const { debit, credit } = financialAccounts[mainCategory][subCategory];

            // Create account record
            const account = await tx.account.create({
              data: {
                name: subCategory,
                debit: parseFloat(debit),
                credit: parseFloat(credit),
                date: new Date(parseInt(year), parseInt(month) - 1, 1),
              },
            });

            // Create transaction for debit
            if (parseFloat(debit) > 0) {
              await tx.transaction.create({
                data: {
                  office_id: office.office_id,
                  directorate_id: directorate.directorate_id,
                  account_id: account.account_id,
                  type_id: 'account_debit',
                  item_id: 'account_item',
                  section_id: 'account_section',
                  chapter_id: 'account_chapter',
                  amount: parseFloat(debit),
                  date: new Date(parseInt(year), parseInt(month) - 1, 1),
                },
              });
            }

            // Create transaction for credit
            if (parseFloat(credit) > 0) {
              await tx.transaction.create({
              data: {
                  office_id: office.office_id,
                  directorate_id: directorate.directorate_id,
                  account_id: account.account_id,
                  type_id: 'account_credit',
                  item_id: 'account_item',
                  section_id: 'account_section',
                  chapter_id: 'account_chapter',
                  amount: parseFloat(credit),
                  date: new Date(parseInt(year), parseInt(month) - 1, 1),
              },
            });
            }
          }
        }
      }
    }); // End of transaction

    return NextResponse.json({ message: 'Data processed and saved successfully' });
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


