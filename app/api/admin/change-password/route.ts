import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, verifyAdminPassword, setOverridePassword } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { currentPassword, newPassword } = await req.json();

  if (!newPassword || String(newPassword).length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }
  if (!(await verifyAdminPassword(currentPassword))) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  await setOverridePassword(newPassword);
  return NextResponse.json({ ok: true });
}
