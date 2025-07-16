// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication should be implemented to get user ID for filtering/assignment

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  // const userId = getUserIdFromAuth(request); // Placeholder for auth
  // if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const tasks = await prisma.task.findMany({
      // where: { user_id: userId }, // Uncomment when auth is implemented
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  // const userId = getUserIdFromAuth(request); // Placeholder for auth
  // if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, due_date, priority, user_id } = body; // user_id might come from auth or body

    if (!title || !priority) {
      return NextResponse.json({ message: 'Title and priority are required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        priority,
        due_date: due_date ? new Date(due_date) : null,
        user_id: user_id, // Assignee ID (optional based on model)
        // completed defaults to false
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
  }
}

