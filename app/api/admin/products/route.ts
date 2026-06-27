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

export async function POST(req: NextRequest) {
  const body = await req.json();
  // "niche" is a required (NOT NULL) DB column not yet exposed in the admin form.
  // Derive from existing fields rather than inventing a value, matching the bulk
  // importer's logic. Real catalogue niches: website-templates, audhd-mini-apps,
  // business-kits-accessories, fitness-wellness, general.
  if (!body.niche) {
    const pt = (body.product_type || '').toLowerCase();
    const catSignal = `${body.category_slug || ''} ${body.category_label || ''}`.toLowerCase();
    if (pt === 'website') body.niche = 'website-templates';
    else if (pt === 'document') body.niche = 'business-kits-accessories';
    else if (pt === 'bundle') body.niche = 'general';
    else if (/audhd|adhd|neurodivergent/.test(catSignal)) body.niche = 'audhd-mini-apps';
    else if (/fitness|wellness/.test(catSignal)) body.niche = 'fitness-wellness';
    else body.niche = 'general';
  }
  const { data, error } = await supabase.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { productId, ...updates } = body;
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  if (!productId) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

