import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE = 'ks_admin_session';

// Every /api/admin/* route (other than the login route itself) must call this
// first and return its response if a NextResponse comes back. Without it,
// anyone who knows the URL can read orders/customers or write products,
// discounts and settings with no password at all.
export function requireAdmin(req: NextRequest): NextResponse | null {
  const session = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!session || session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
