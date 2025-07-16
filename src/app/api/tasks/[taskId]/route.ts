// src/app/api/tasks/[taskId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented to protect these routes

// GET /api/tasks/[taskId] - Fetch a single task by ID (Optional, implement if needed)
export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { task_id: taskId },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);

  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    return NextResponse.json({ message: 'Error fetching task data' }, { status: 500 });
  }
}

// PUT /api/tasks/[taskId] - Update a task by ID (e.g., mark complete)
export async function PUT(request: NextRequest, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, due_date, priority, completed, user_id } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (priority !== undefined) updateData.priority = priority;
    if (completed !== undefined) updateData.completed = completed;
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date) : null;
    if (user_id !== undefined) updateData.user_id = user_id; // Update assignee

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No update data provided' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { task_id: taskId },
      data: updateData,
    });

    return NextResponse.json(updatedTask);

  } catch (error: any) {
    console.error(`Error updating task ${taskId}:`, error);
    if (error.code === 'P2025') { // Prisma code for record not found
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[taskId] - Delete a task by ID
export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
  const taskId = parseInt(params.taskId, 10);

  if (isNaN(taskId)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { task_id: taskId },
    });

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 }); // Or 204 No Content

  } catch (error: any) {
    console.error(`Error deleting task ${taskId}:`, error);
    if (error.code === 'P2025') { // Prisma code for record not found
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
  }
}

