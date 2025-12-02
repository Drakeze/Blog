import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin-auth';
const COOKIE_MAX_AGE = 60 * 60 * 6; // 6 hours

export async function GET(request: NextRequest) {
  const authorized = request.cookies.get(COOKIE_NAME)?.value === 'true';
  return NextResponse.json({ authorized });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body ?? {};
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json({ error: 'Admin password is not configured.' }, { status: 500 });
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
