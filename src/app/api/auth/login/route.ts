// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import api from '@/services/api';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const response = await api.post('/v1/auth/authenticate', { email, password });
    const { access_token, refresh_token } = response.data;

    const accessTokenCookie = serialize('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    });

    const refreshTokenCookie = serialize('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    const res = NextResponse.json({ message: 'Login successful' });
    res.headers.append('Set-Cookie', accessTokenCookie);
    res.headers.append('Set-Cookie', refreshTokenCookie);

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
}
