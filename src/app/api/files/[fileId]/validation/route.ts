// src/app/api/files/[fileId]/validation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented if needed

// GET /api/files/[fileId]/validation - Fetch validation results for a specific file
export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  const fileId = parseInt(params.fileId, 10);

  if (isNaN(fileId)) {
    return NextResponse.json({ message: 'Invalid file ID' }, { status: 400 });
  }

  try {
    // Check if the file exists first (optional but good practice)
    const file = await prisma.importedFile.findUnique({
      where: { file_id: fileId },
      select: { file_id: true, status: true } // Select only needed fields
    });

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    // Fetch related financial data entries which contain validation status
    const validationResults = await prisma.financialDataEntry.findMany({
      where: {
        imported_file_id: fileId,
        // Optionally filter by validation_status: 'Invalid' if needed
      },
      select: {
        entry_id: true,
        // Include fields relevant to identifying the row in the Excel file (e.g., row number if stored)
        // For now, just returning basic info
        validation_status: true,
        validation_details: true,
        // Include related Revenue/Use/AccountType info if helpful for context
        revenueType: { select: { name: true } },
        useType: { select: { name: true } },
        accountType: { select: { name: true } },
        amount_total: true,
      },
      orderBy: { entry_id: 'asc' }, // Or order by row number if available
    });

    // You might want to format this response further based on frontend needs
    return NextResponse.json({ fileStatus: file.status, results: validationResults });

  } catch (error) {
    console.error(`Error fetching validation results for file ${fileId}:`, error);
    return NextResponse.json({ message: 'Error fetching validation results' }, { status: 500 });
  }
}

