import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const ADMIN_COOKIE = 'ks_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_HASH_KEY = 'admin_password_hash';

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Password hashing (scrypt, random salt per hash) — used only for the
// optional in-app override password, never for the Vercel env var, which
// stays a plain comparison since it's the recovery key of last resort.
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

export async function setOverridePassword(newPassword: string): Promise<void> {
  await sb.from('site_settings').upsert(
    { key: PASSWORD_HASH_KEY, value: hashPassword(newPassword), updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  );
}

// Two independent ways in: the Vercel env var (the permanent recovery key —
// always works, changeable only by whoever controls the Vercel project, so
// it can never be lost from inside the app) and an optional Supabase-stored
// override password the admin can change any time from Settings without a
// redeploy. Either one logs you in.
export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  if (!candidate) return false;
  if (candidate === process.env.ADMIN_PASSWORD) return true;

  const { data } = await sb.from('site_settings').select('value').eq('key', PASSWORD_HASH_KEY).single();
  if (data?.value) return verifyHash(candidate, data.value);
  return false;
}

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
