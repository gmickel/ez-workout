import { env } from '@/app/env';
import { db } from '@/lib/db';
import { users } from '@/models/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = env.JWT_SECRET ?? 'your-secret-key-yep';

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (user.length === 0) {
    return false;
  }

  const firstUser = user[0];

  if (!firstUser?.passwordHash) {
    return false;
  }

  return bcrypt.compare(password, firstUser.passwordHash);
}
export async function generateToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('authToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 1 day
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('authToken');
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('authToken')?.value;
  if (!token) return false;
  return verifyToken(token);
}
