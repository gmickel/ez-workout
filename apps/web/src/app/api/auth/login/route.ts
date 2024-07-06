import { generateToken, login, setAuthCookie } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (await login(username, password)) {
    const token = await generateToken(username);
    const response = NextResponse.json({ success: true });
    setAuthCookie(response, token);
    return response;
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 },
  );
}
