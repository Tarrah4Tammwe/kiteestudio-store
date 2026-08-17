import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const ADMIN_COOKIE = 'ks_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Session tokens are HMAC-signed with the admin password as the key, so the
// password itself never sits in the browser's cookie jar (previously the
// cookie *was* the raw password — anything that ever logged or displayed
// that cookie, a browser extension, an error report, a shared devtools
// screenshot, would have handed over the real credential, not a revocable
// token). The signature also carries its own expiry, checked server-side,
// instead of relying solely on the cookie's own maxAge.
function sign(payload: string): string {
  return crypto.createHmac('sha256', process.env.ADMIN_PASSWORD || '').update(payload).digest('hex');
}

export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

// Every /api/admin/* route (other than the login route itself) must call this
// first and return its response if a NextResponse comes back. Without it,
// anyone who knows the URL can read orders/customers or write products,
// discounts and settings with no password at all.
export function requireAdmin(req: NextRequest): NextResponse | null {
  const session = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!session) return unauthorized();

  const [payload, sig] = session.split('.');
  if (!payload || !sig) return unauthorized();

  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return unauthorized();
  }
  if (Date.now() > Number(payload)) return unauthorized();

  return null;
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
