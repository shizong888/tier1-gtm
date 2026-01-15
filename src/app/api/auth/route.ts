import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const expectedHash = process.env.PASSWORD_HASH;

    if (!expectedHash) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // In production, you'd hash the password and compare
    // For simplicity, we're comparing the password directly with the hash value
    if (password === expectedHash) {
      const response = NextResponse.json({ success: true });

      // Set httpOnly cookie that expires in 7 days
      response.cookies.set('tier1-auth', expectedHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
