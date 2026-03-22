// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const accessTokenCookie = serialize('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    path: '/',
    sameSite: 'strict',
    maxAge: -1,
  });

  const refreshTokenCookie = serialize('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    path: '/',
    sameSite: 'strict',
    maxAge: -1,
  });

  const res = NextResponse.json({ message: 'Logout successful' });
  res.headers.append('Set-Cookie', accessTokenCookie);
  res.headers.append('Set-Cookie', refreshTokenCookie);

  return res;
}
