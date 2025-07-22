// src/app/api/directorates/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const directorates = await prisma.directorate.findMany({
      include: {
        offices: true,
      },
    });

    return NextResponse.json(directorates);
  } catch (error) {
    console.error('Error fetching directorates:', error);
    return NextResponse.json({ error: 'Failed to fetch directorates' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Directorate name is required' }, { status: 400 });
    }

    const directorate = await prisma.directorate.create({
      data: { name },
      include: {
        offices: true,
      },
    });

    return NextResponse.json(directorate);
  } catch (error) {
    console.error('Error creating directorate:', error);
    return NextResponse.json({ error: 'Failed to create directorate' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

