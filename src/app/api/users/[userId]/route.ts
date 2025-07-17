// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/authUtils';

// GET /api/users/[userId] - Get a user by ID
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
}

// PUT /api/users/[userId] - Update a user by ID
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, password, role } = body;

    // Basic validation
    if (!email && !name) {
      return NextResponse.json({ message: 'Email or name is required for update' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) {
      // Validate role
      const validRoles = ['administrator', 'employee', 'reviewer'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { message: 'Invalid role. Must be administrator, employee, or reviewer' },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    // Hash password only if a new one is provided
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

// DELETE /api/users/[userId] - Delete a user by ID
export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Delete the user
    await prisma.user.delete({
      where: { user_id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}

