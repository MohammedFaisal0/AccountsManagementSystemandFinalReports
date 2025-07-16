// src/app/api/offices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented if needed

// GET /api/offices - List offices, optionally filtered by directorate
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const directorateId = searchParams.get('directorateId');

  let whereClause = {};
  if (directorateId) {
    const id = parseInt(directorateId, 10);
    if (!isNaN(id)) {
      whereClause = { directorate_id: id };
    } else {
      return NextResponse.json({ message: 'Invalid directorateId parameter' }, { status: 400 });
    }
  }

  try {
    const offices = await prisma.office.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(offices);
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json({ message: 'Error fetching offices' }, { status: 500 });
  }
}

