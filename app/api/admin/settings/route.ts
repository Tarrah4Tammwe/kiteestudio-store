import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await sb.from('site_settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const settings: Record<string, string> = {};
  (data || []).forEach((row: any) => { settings[row.key] = row.value; });
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const { updates } = await req.json(); // { key: value, ... }
  const upserts = Object.entries(updates).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
  const { error } = await sb.from('site_settings').upsert(upserts, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
