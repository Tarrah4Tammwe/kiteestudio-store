import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_MAX_AGE, createSessionToken, verifyAdminPassword } from '@/lib/adminAuth';

// In-memory lockout: 5 attempts per IP per 15 minutes. This resets on a
// cold start / redeploy so it isn't a substitute for a real distributed
// limiter (Vercel Firewall / Upstash) under sustained attack, but it closes
// the gap that existed before — unlimited, instant password guesses with
// zero backoff — for the common case of an opportunistic scanner or bot.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  const { password } = await req.json();

  if (await verifyAdminPassword(password)) {
    attempts.delete(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  }

  const next = entry && entry.resetAt > now ? { count: entry.count + 1, resetAt: entry.resetAt } : { count: 1, resetAt: now + WINDOW_MS };
  attempts.set(ip, next);

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
