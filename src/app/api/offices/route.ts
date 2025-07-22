// src/app/api/offices/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      include: {
        directorate: true,
      },
    });

    return NextResponse.json(offices);
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json({ error: 'Failed to fetch offices' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { name, directorate_id } = await request.json();

    if (!name || !directorate_id) {
      return NextResponse.json({ error: 'Office name and directorate_id are required' }, { status: 400 });
    }

    const office = await prisma.office.create({
      data: { name, directorate_id: parseInt(directorate_id) },
      include: {
        directorate: true,
      },
    });

    return NextResponse.json(office);
  } catch (error) {
    console.error('Error creating office:', error);
    return NextResponse.json({ error: 'Failed to create office' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

