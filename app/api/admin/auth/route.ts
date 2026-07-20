import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    // Every other /api/admin/* route checks this cookie server-side — without
    // it, those routes had no auth at all beyond the client hiding the UI.
    res.cookies.set(ADMIN_COOKIE, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
