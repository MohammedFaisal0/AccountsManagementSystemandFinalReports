// src/app/api/reports/financial-data/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication/authorization checks should be added (e.g., verify JWT)

    const { searchParams } = new URL(request.url);
    const directorateIdStr = searchParams.get("directorateId");
    const officeIdStr = searchParams.get("officeId");
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");
    const accountTypeIdStr = searchParams.get("accountTypeId");
    // Add more filters as needed (e.g., revenue/use type)

    // Build the where clause for Prisma query dynamically
    const whereClause: any = {};

    // --- Input Validation and Parsing ---
    let directorateId: number | undefined;
    let officeId: number | undefined;
    let month: number | undefined;
    let year: number | undefined;
    let accountTypeId: number | undefined;

    try {
        if (directorateIdStr) directorateId = parseInt(directorateIdStr);
        if (officeIdStr) officeId = parseInt(officeIdStr);
        if (monthStr) month = parseInt(monthStr);
        if (yearStr) year = parseInt(yearStr);
        if (accountTypeIdStr) accountTypeId = parseInt(accountTypeIdStr);
    } catch (e) {
        return NextResponse.json({ message: "Invalid numeric filter parameter format" }, { status: 400 });
    }

    // --- Apply Filters ---
    if (officeId) whereClause.office_id = officeId;
    if (accountTypeId) whereClause.account_type_id = accountTypeId;

    // If directorateId is provided (and not officeId), filter by offices within that directorate
    if (directorateId && !officeId) {
       const officesInDirectorate = await prisma.office.findMany({
           where: { directorate_id: directorateId },
           select: { office_id: true }
       });
       const officeIds = officesInDirectorate.map(o => o.office_id);
       if (officeIds.length > 0) {
           whereClause.office_id = { in: officeIds };
       } else {
           // No offices found for this directorate, return empty
           return NextResponse.json([]);
       }
    }

    // Add filtering by month/year if provided (filters by the ImportedFile relationship)
    if (month || year) {
        const fileWhereClause: any = {};
        if (month) fileWhereClause.month = month;
        if (year) fileWhereClause.year = year;
        // If filtering by directorate, add it to file filter too
        if (directorateId) fileWhereClause.directorate_id = directorateId;

        // Find relevant file IDs first
        const relevantFiles = await prisma.importedFile.findMany({
            where: fileWhereClause,
            select: { file_id: true }
        });
        const fileIds = relevantFiles.map(f => f.file_id);
        
        if (fileIds.length > 0) {
            // Add file ID filter to the main where clause
            if (whereClause.imported_file_id) {
                // If already filtering by file IDs (e.g., from another condition), intersect
                whereClause.imported_file_id = { in: whereClause.imported_file_id.in.filter((id: number) => fileIds.includes(id)) };
            } else {
                whereClause.imported_file_id = { in: fileIds };
            }
            // If intersection results in empty list, return empty
            if (whereClause.imported_file_id.in.length === 0) {
                 return NextResponse.json([]);
            }
        } else {
             // No files match the time/directorate criteria, return empty
            return NextResponse.json([]);
        }
    }


    // Fetch the financial data entries based on filters
    const financialData = await prisma.financialDataEntry.findMany({
      where: whereClause,
      include: {
        // Include related data needed for reporting
        office: {
          select: { name: true, directorate: { select: { name: true } } }
        },
        accountType: { select: { name: true } },
        // Include full hierarchy for revenue/use if needed
        revenueType: {
          include: {
            item: {
              include: {
                section: {
                  include: { chapter: true }
                }
              }
            }
          }
        },
        useType: {
          include: {
            item: {
              include: {
                section: {
                  include: { chapter: true }
                }
              }
            }
          }
        },
        importedFile: { select: { original_file_name: true, month: true, year: true } }
      },
      // Add ordering if needed
      orderBy: {
        created_at: 'desc', // Example ordering
      },
    });

          // Aggregation logic should be implemented here if needed based on a reportType parameter
    // Example: Group by office, sum amounts, etc.

    return NextResponse.json(financialData);

  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, userId, directorateId, month, year } = body;
    if (!data || !userId || !directorateId || !month || !year) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    // Example: Save each entry in the processed data (assuming data is an array of entries)
    // You may need to adjust this based on your actual data structure
    const createdEntries = [];
    for (const entry of Array.isArray(data) ? data : [data]) {
      const created = await prisma.financialDataEntry.create({
        data: {
          // Map fields from entry to your Prisma model
          ...entry,
          user_id: userId,
          directorate_id: directorateId,
          month,
          year,
        },
      });
      createdEntries.push(created);
    }
    return NextResponse.json({ message: 'Data imported successfully', entries: createdEntries }, { status: 201 });
  } catch (error) {
    console.error('Error importing financial data:', error);
    return NextResponse.json({ message: 'Error importing financial data' }, { status: 500 });
  }
}

