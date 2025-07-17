import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getAuth } from '@clerk/nextjs/server'; // Assuming Clerk for authentication based on project structure

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // In a real application, you would get the userId from the authenticated session
    // For now, we'll use a placeholder or assume it's passed in the payload if needed.
    // const { userId } = getAuth(request);
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
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

      // 2. Create ImportedFile Record
      const importedFile = await tx.importedFile.create({
        data: {
          file_name: file_name,
          original_file_name: file_name, // Assuming original_file_name is same as file_name for now
          user_id: userId,
          directorate_id: directorate.directorate_id,
          month: parseInt(month),
          year: parseInt(year),
          status: 'Processed', // Status after Python processing
        },
      });

      // Placeholder for office_id. In a real scenario, you'd extract this from Excel
      // or have a default/lookup mechanism.
      const officeId = 1; // Assuming a default office for now. Adjust as needed.
      // Ensure the office exists or create it if necessary
      let office = await tx.office.findUnique({ where: { office_id: officeId } });
      if (!office) {
        // This is a basic creation. You might need to link it to a directorate if not already.
        office = await tx.office.create({ data: { office_id: officeId, name: 'Default Office', directorate_id: directorate.directorate_id } });
      }

      // 3. Process and Insert Financial Data Entries
      if (sheet_number_processed === 1) {
        // Hierarchical Data (Revenue/Use types)
        const { chapters, sections, items, types } = processed_data;

        // Helper function to find or create hierarchical entities and return their ID
        const findOrCreateRevenueChapter = async (code: string, name: string) => {
          let chapter = await tx.revenueChapter.findUnique({ where: { code } });
          if (!chapter) {
            chapter = await tx.revenueChapter.create({ data: { code, name } });
          }
          return chapter.chapter_id;
        };

        const findOrCreateRevenueSection = async (code: string, name: string, chapter_id: number) => {
          let section = await tx.revenueSection.findUnique({ where: { code_chapter_id: { code, chapter_id } } });
          if (!section) {
            section = await tx.revenueSection.create({ data: { code, name, chapter_id } });
          }
          return section.section_id;
        };

        const findOrCreateRevenueItem = async (code: string, name: string, section_id: number) => {
          let item = await tx.revenueItem.findUnique({ where: { code_section_id: { code, section_id } } });
          if (!item) {
            item = await tx.revenueItem.create({ data: { code, name, section_id } });
          }
          return item.item_id;
        };

        const findOrCreateRevenueType = async (code: string, name: string, item_id: number) => {
          let type = await tx.revenueType.findUnique({ where: { code_item_id: { code, item_id } } });
          if (!type) {
            type = await tx.revenueType.create({ data: { code, name, item_id } });
          }
          return type.type_id;
        };

        // Process Chapters
        for (const chapterData of chapters) {
          const chapter_id = await findOrCreateRevenueChapter(chapterData.id, chapterData.name);
          await tx.financialDataEntry.create({
            data: {
              imported_file_id: importedFile.file_id,
              office_id: officeId,
              revenue_type_id: null, // Chapters don't map directly to RevenueType
              use_type_id: null, // Assuming this is for revenue side
              account_type_id: 1, // Placeholder: Map to a generic 'Chapter' account type if needed
              amount_current_month: parseFloat(chapterData.value),
              amount_previous_months: 0,
              amount_total: parseFloat(chapterData.value),
              validation_status: 'Valid',
            },
          });
        }

        // Process Sections
        for (const sectionData of sections) {
          const chapterCode = sectionData.id.split('_')[0];
          const chapter = await tx.revenueChapter.findUnique({ where: { code: chapterCode } });
          if (!chapter) { console.warn(`Chapter ${chapterCode} not found for section ${sectionData.id}`); continue; }
          const section_id = await findOrCreateRevenueSection(sectionData.id, sectionData.name, chapter.chapter_id);
          await tx.financialDataEntry.create({
            data: {
              imported_file_id: importedFile.file_id,
              office_id: officeId,
              revenue_type_id: null, // Sections don't map directly to RevenueType
              use_type_id: null,
              account_type_id: 1, // Placeholder: Map to a generic 'Section' account type if needed
              amount_current_month: parseFloat(sectionData.value),
              amount_previous_months: 0,
              amount_total: parseFloat(sectionData.value),
              validation_status: 'Valid',
            },
          });
        }

        // Process Items
        for (const itemData of items) {
          const sectionCode = itemData.id.substring(0, itemData.id.lastIndexOf('_'));
          const section = await tx.revenueSection.findFirst({ where: { code: sectionCode } });
          if (!section) { console.warn(`Section ${sectionCode} not found for item ${itemData.id}`); continue; }
          const item_id = await findOrCreateRevenueItem(itemData.id, itemData.name, section.section_id);
          await tx.financialDataEntry.create({
            data: {
              imported_file_id: importedFile.file_id,
              office_id: officeId,
              revenue_type_id: null, // Items don't map directly to RevenueType
              use_type_id: null,
              account_type_id: 1, // Placeholder: Map to a generic 'Item' account type if needed
              amount_current_month: parseFloat(itemData.value),
              amount_previous_months: 0,
              amount_total: parseFloat(itemData.value),
              validation_status: 'Valid',
            },
          });
        }

        // Process Types (these map directly to RevenueType/UseType)
        for (const typeData of types) {
          const itemCode = typeData.id.substring(0, typeData.id.lastIndexOf('_'));
          const item = await tx.revenueItem.findFirst({ where: { code: itemCode } });
          if (!item) { console.warn(`Item ${itemCode} not found for type ${typeData.id}`); continue; }
          const revenue_type_id = await findOrCreateRevenueType(typeData.id, typeData.name, item.item_id);
          await tx.financialDataEntry.create({
            data: {
              imported_file_id: importedFile.file_id,
              office_id: officeId,
              revenue_type_id: revenue_type_id,
              use_type_id: null, // Assuming this is for revenue side
              account_type_id: 1, // Placeholder: Map to a generic 'Type' account type if needed
              amount_current_month: parseFloat(typeData.value),
              amount_previous_months: 0,
              amount_total: parseFloat(typeData.value),
              validation_status: 'Valid',
            },
          });
        }

      } else if (sheet_number_processed === 2) {
        // Financial Accounts Data (Debit/Credit)
        const financialAccounts = processed_data;

        for (const mainCategory in financialAccounts) {
          for (const subCategory in financialAccounts[mainCategory]) {
            const { debit, credit } = financialAccounts[mainCategory][subCategory];

            // Find or Create AccountType
            let accountType = await tx.accountType.findUnique({
              where: { name: subCategory }, // Using subCategory as account type name
            });

            if (!accountType) {
              accountType = await tx.accountType.create({
                data: { name: subCategory },
              });
            }

            await tx.financialDataEntry.create({
              data: {
                imported_file_id: importedFile.file_id,
                office_id: officeId,
                account_type_id: accountType.account_type_id,
                amount_current_month: parseFloat(debit),
                amount_previous_months: 0, // Placeholder
                amount_total: parseFloat(debit) + parseFloat(credit), // Example total
                validation_status: 'Valid',
              },
            });
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


