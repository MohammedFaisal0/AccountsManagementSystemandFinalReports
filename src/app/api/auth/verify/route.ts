// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/authUtils";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || !user.status) {
      return NextResponse.json(
        { message: 'User not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Token verification failed' },
      { status: 500 }
    );
  }
} 