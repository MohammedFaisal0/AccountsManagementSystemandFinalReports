// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// POST /api/auth/logout - Clear the authentication cookie
export async function POST(request: NextRequest) {
  try {
    // Create a response to clear the cookie
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Set the cookie with an expiry date in the past
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      expires: new Date(0), // Set expiry date to the past
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}

