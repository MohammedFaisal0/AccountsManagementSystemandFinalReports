// src/app/api/report-types/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Authentication middleware should be implemented if needed

// Define report types (could be moved to a config file or fetched from DB if dynamic)
const REPORT_TYPES = [
  { label: 'تقرير شهري', value: 'monthly' },
  { label: 'تقرير ربع سنوي', value: 'quarterly' },
  { label: 'تقرير سنوي', value: 'annual' },
];

// GET /api/report-types - List all available report types
export async function GET(request: NextRequest) {
  try {
    // In a real application, these might come from a database table
    // For now, returning the constant defined above
    return NextResponse.json(REPORT_TYPES);
  } catch (error) {
    console.error('Error fetching report types:', error);
    return NextResponse.json({ message: 'Error fetching report types' }, { status: 500 });
  }
}

