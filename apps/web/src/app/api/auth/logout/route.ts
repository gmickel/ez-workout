import { clearAuthCookie } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}
