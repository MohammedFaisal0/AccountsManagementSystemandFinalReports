// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { comparePassword, generateToken } from "@/lib/authUtils";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !['administrator', 'employee', 'reviewer'].includes(role)) {
      return NextResponse.json(
        { message: 'نوع الحساب غير صحيح' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Check if user has the selected role (if role is provided)
    if (role && user.role !== role) {
      return NextResponse.json(
        { message: `هذا الحساب ليس من نوع ${role === 'administrator' ? 'مدير النظام' : role === 'employee' ? 'موظف' : 'مراجع'}` },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

