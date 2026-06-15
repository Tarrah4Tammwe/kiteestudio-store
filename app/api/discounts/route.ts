import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const { data, error } = await sb.from('discount_codes')
    .select('*').eq('code', code.toUpperCase()).eq('active', true).single();
  if (error || !data) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  if (data.expires_at && new Date(data.expires_at) < new Date())
    return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
  if (data.max_uses && data.uses_count >= data.max_uses)
    return NextResponse.json({ error: 'Code usage limit reached' }, { status: 400 });
  return NextResponse.json({ valid: true, type: data.type, value: data.value, id: data.id });
}
