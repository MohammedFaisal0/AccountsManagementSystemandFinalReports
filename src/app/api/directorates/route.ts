// src/app/api/directorates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented if needed

// GET /api/directorates - List all directorates
export async function GET(request: NextRequest) {
  try {
    const directorates = await prisma.directorate.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(directorates);
  } catch (error) {
    console.error('Error fetching directorates:', error);
    return NextResponse.json({ message: 'Error fetching directorates' }, { status: 500 });
  }
}

