// src/app/api/reports/financial-data/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const directorateId = searchParams.get('directorateId');
    const officeId = searchParams.get('officeId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const accountType = searchParams.get('accountType'); // 'revenue' or 'use'

    // Build where clause
    const whereClause: any = {};

    if (directorateId) {
      whereClause.directorate_id = parseInt(directorateId);
    }

    if (officeId) {
      whereClause.office_id = parseInt(officeId);
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (accountType) {
      whereClause.account_id = accountType === 'revenue' ? 1 : 2;
    }

    // Get transactions with related data
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        office: {
          include: {
            directorate: true,
          },
        },
        chapter: true,
        section: true,
        item: true,
        type: true,
      },
      orderBy: [
        { chapter_id: 'asc' },
        { section_id: 'asc' },
        { item_id: 'asc' },
        { type_id: 'asc' },
      ],
    });

    // Group transactions by hierarchy
    const groupedData = transactions.reduce((acc, transaction) => {
      const chapterKey = transaction.chapter_id;
      const sectionKey = transaction.section_id;
      const itemKey = transaction.item_id;
      const typeKey = transaction.type_id;

      if (!acc[chapterKey]) {
        acc[chapterKey] = {
          chapter_id: transaction.chapter_id,
          chapter_name: transaction.chapter.name,
          total_amount: 0,
          sections: {},
        };
      }

      if (!acc[chapterKey].sections[sectionKey]) {
        acc[chapterKey].sections[sectionKey] = {
          section_id: transaction.section_id,
          section_name: transaction.section.name,
          total_amount: 0,
          items: {},
        };
      }

      if (!acc[chapterKey].sections[sectionKey].items[itemKey]) {
        acc[chapterKey].sections[sectionKey].items[itemKey] = {
          item_id: transaction.item_id,
          item_name: transaction.item.name,
          total_amount: 0,
          types: {},
        };
      }

      if (!acc[chapterKey].sections[sectionKey].items[itemKey].types[typeKey]) {
        acc[chapterKey].sections[sectionKey].items[itemKey].types[typeKey] = {
          type_id: transaction.type_id,
          type_name: transaction.type.name,
          amount: 0,
          office: transaction.office.name,
          directorate: transaction.office.directorate.name,
        };
      }

      acc[chapterKey].sections[sectionKey].items[itemKey].types[typeKey].amount += Number(transaction.amount);
      acc[chapterKey].sections[sectionKey].items[itemKey].total_amount += Number(transaction.amount);
      acc[chapterKey].sections[sectionKey].total_amount += Number(transaction.amount);
      acc[chapterKey].total_amount += Number(transaction.amount);

      return acc;
    }, {} as any);

    return NextResponse.json({
      transactions: groupedData,
      summary: {
        total_transactions: transactions.length,
        total_amount: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
        directorate_count: new Set(transactions.map(t => t.directorate_id)).size,
        office_count: new Set(transactions.map(t => t.office_id)).size,
        },
      });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

