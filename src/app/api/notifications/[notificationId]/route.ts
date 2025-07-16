// src/app/api/notifications/[notificationId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Authentication middleware should be implemented to ensure user owns the notification

// PUT /api/notifications/[notificationId] - Mark a notification as read
export async function PUT(request: NextRequest, { params }: { params: { notificationId: string } }) {
  const notificationId = parseInt(params.notificationId, 10);
  // const userId = getUserIdFromAuth(request); // Placeholder for auth

  if (isNaN(notificationId)) {
    return NextResponse.json({ message: 'Invalid notification ID' }, { status: 400 });
  }

  // if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const updatedNotification = await prisma.notification.updateMany({
      where: {
        notification_id: notificationId,
        // user_id: userId, // Ensure user can only update their own notifications
      },
      data: {
        is_read: true,
      },
    });

    if (updatedNotification.count === 0) {
      // Either notification doesn't exist or doesn't belong to the user
      return NextResponse.json({ message: 'Notification not found or access denied' }, { status: 404 });
    }

    // Fetch the updated notification to return it (optional, updateMany doesn't return the record)
    const notification = await prisma.notification.findUnique({
        where: { notification_id: notificationId }
    });

    return NextResponse.json(notification);

  } catch (error: any) {
    console.error(`Error updating notification ${notificationId}:`, error);
    if (error.code === 'P2025') { // Prisma code for record not found (less likely with updateMany check)
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating notification' }, { status: 500 });
  }
}

