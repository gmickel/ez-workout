import { isAuthenticated } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (await isAuthenticated(request)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
