// src/app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented to filter files based on user roles/permissions

// GET /api/files - List uploaded files
export async function GET(request: NextRequest) {
  // const userId = getUserIdFromAuth(request); // Placeholder for auth
  // const userRole = getUserRole(request); // Placeholder for auth

  // Add filtering based on query parameters if needed (e.g., ?directorateId=1&status=Imported)
  const { searchParams } = new URL(request.url);
  const directorateId = searchParams.get('directorateId');
  const status = searchParams.get('status');

  let whereClause: any = {};
  if (directorateId) {
    const id = parseInt(directorateId, 10);
    if (!isNaN(id)) {
      whereClause.directorate_id = id;
    } else {
      return NextResponse.json({ message: 'Invalid directorateId parameter' }, { status: 400 });
    }
  }
  if (status) {
    whereClause.status = status;
  }

  // Add role-based filtering here if necessary
  // if (userRole === 'employee') { whereClause.user_id = userId; }

  try {
    const files = await prisma.importedFile.findMany({
      where: whereClause,
      include: {
        user: { select: { user_id: true, name: true } }, // Include uploader info
        directorate: { select: { directorate_id: true, name: true } }, // Include directorate info
      },
      orderBy: { upload_timestamp: 'desc' },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ message: 'Error fetching files' }, { status: 500 });
  }
}

// Note: POST for uploading files is handled by /api/files/upload/route.ts

