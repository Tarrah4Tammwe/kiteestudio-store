import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('product_type', { ascending: false })
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { productId, price, status } = body;

  const updates: Record<string, any> = {};
  if (price !== undefined) updates.price_gbp = price;
  if (status !== undefined) updates.status = status;

  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
