import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = 1; // Placeholder for demonstration. Replace with actual authenticated user ID.

    const data = await request.json();
    console.log('Received data from frontend:', JSON.stringify(data, null, 2));

    // اطبع قائمة النماذج المتاحة في Prisma transaction
    console.log('DEBUG: قبل بدء الترانزاكشن، قائمة النماذج المتاحة في Prisma Client:', Object.keys(prisma));

    const {
      file_name,
      month,
      year,
      directorate_name,
      office_name,
      sheet_number_processed,
      processed_data,
      hierarchical_rows
    } = data;

    await prisma.$transaction(async (tx) => {
      // اطبع قائمة النماذج المتاحة في transaction
      console.log('DEBUG: قائمة النماذج المتاحة في tx:', Object.keys(tx));
      // 1. Find or Create Directorate
      let directorate = null;
      if (directorate_name) {
        directorate = await tx.directorate.findUnique({ where: { name: directorate_name } });
      if (!directorate) {
          directorate = await tx.directorate.create({ data: { name: directorate_name } });
        }
      }

      // 2. Find or Create Office (if office_name provided)
      let office = null;
      if (office_name && directorate) {
        office = await tx.office.findFirst({ where: { name: office_name, directorate_id: directorate.directorate_id } });
      if (!office) {
          office = await tx.office.create({ data: { name: office_name, directorate_id: directorate.directorate_id } });
        }
      }

      // 3. إذا كانت الصفحة الأولى، عالج فقط hierarchical_rows
      if (sheet_number_processed === 1) {
        if (!Array.isArray(hierarchical_rows) || hierarchical_rows.length === 0) {
          throw new Error('لم يتم العثور على بيانات هرمية صالحة للترحيل.');
        }
        for (const row of hierarchical_rows) {
          // تأكد من وجود كل المفاتيح المطلوبة
          if (!row.chapter_id || !row.section_id || !row.item_id || !row.type_id) {
            continue;
          }
          // ابحث أو أنشئ directorate وoffice لكل صف
          let rowDirectorate = directorate;
          if (row.directorate_name) {
            rowDirectorate = await tx.directorate.findUnique({ where: { name: row.directorate_name } });
            if (!rowDirectorate) {
              rowDirectorate = await tx.directorate.create({ data: { name: row.directorate_name } });
            }
          }
          let rowOffice = office;
          if (row.office_name && rowDirectorate) {
            rowOffice = await tx.office.findFirst({ where: { name: row.office_name, directorate_id: rowDirectorate.directorate_id } });
            if (!rowOffice) {
              rowOffice = await tx.office.create({ data: { name: row.office_name, directorate_id: rowDirectorate.directorate_id } });
            }
          }
          // ابحث أو أنشئ الكيانات الهرمية
          const findOrCreate = async (model: any, idField: string, idValue: string, data: any) => {
            let entity = await tx[model].findUnique({ where: { [idField]: idValue } });
            if (!entity) {
              entity = await tx[model].create({ data });
            }
            return entity;
          };
          await findOrCreate('chapter', 'chapter_id', row.chapter_id, { chapter_id: row.chapter_id, name: row.chapter_id });
          await findOrCreate('section', 'section_id', row.section_id, { section_id: row.section_id, name: row.section_id, chapter_id: row.chapter_id });
          await findOrCreate('item', 'item_id', row.item_id, { item_id: row.item_id, name: row.item_id, section_id: row.section_id });
          await findOrCreate('type', 'type_id', row.type_id, { type_id: row.type_id, name: row.type_name || row.name, item_id: row.item_id });
          // أنشئ الترانزاكشن
          await tx.transaction.create({
            data: {
              office_id: rowOffice ? rowOffice.office_id : null,
              directorate_id: rowDirectorate ? rowDirectorate.directorate_id : null,
              type_id: row.type_id,
              item_id: row.item_id,
              section_id: row.section_id,
              chapter_id: row.chapter_id,
              amount: parseFloat(row.value),
              date: row.timestamp ? new Date(row.timestamp) : new Date(),
            },
          });
        }
        return;
      }

      // 2. Create ImportedFile Record
      const importedFile = await tx.importedFile.create({
        data: {
          file_name: file_name,
          original_file_name: file_name, // Assuming original_file_name is same as file_name for now
          user_id: userId,
          directorate_id: directorate ? directorate.directorate_id : null,
          month: parseInt(month),
          year: parseInt(year),
          status: 'Processed', // Status after Python processing
        },
      });

      // Placeholder for office_id. In a real scenario, you'd extract this from Excel
      // or have a default/lookup mechanism.
      const officeId = office ? office.office_id : 1; // Assuming a default office for now. Adjust as needed.
      // Ensure the office exists or create it if necessary
      let officeEntity = await tx.office.findUnique({ where: { office_id: officeId } });
      if (!officeEntity) {
        // This is a basic creation. You might need to link it to a directorate if not already.
        officeEntity = await tx.office.create({ data: { office_id: officeId, name: 'Default Office', directorate_id: directorate ? directorate.directorate_id : null } });
      }

      // 3. Process and Insert Financial Data Entries
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
                office_id: officeEntity.office_id,
                directorate_id: directorate ? directorate.directorate_id : null,
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
            const entry = financialAccounts[mainCategory][subCategory];
            if (!entry || !entry.id) continue; // تجاهل أي حساب بدون id

            const accna_id = entry.id;
            const debit = entry.debit || 0;
            const credit = entry.credit || 0;

            // تجاهل الحسابات التي ليس لها أي قيمة مالية
            if (debit === 0 && credit === 0) continue;

            await prisma.account.create({
              data: {
                accna_id,
                debit,
                credit,
                date: new Date(),
                office_id: office.office_id,
                directorate_id: directorate.directorate_id,
              },
            });
          }
        }
      }
    }); // End of transaction

    return NextResponse.json({ message: 'Data processed and saved successfully' });
  } catch (error) {
    console.error('Error processing data:', error instanceof Error ? error.stack : error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


