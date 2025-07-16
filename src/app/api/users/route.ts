// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/authUtils';

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { role: { contains: search } },
          ],
        }
      : {};

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar_url: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as string;
    const avatar = formData.get('avatar') as File | null;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['administrator', 'employee', 'reviewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role. Must be administrator, employee, or reviewer' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Handle avatar upload if provided
    let avatarUrl = null;
    if (avatar) {
      // For now, we'll store a placeholder URL
      // In a real application, you'd upload to a cloud service like AWS S3
      avatarUrl = `/uploads/avatars/${Date.now()}-${avatar.name}`;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        phone: phone?.trim() || null,
        role: role,
        avatar_url: avatarUrl,
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar_url: true,
        created_at: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}

