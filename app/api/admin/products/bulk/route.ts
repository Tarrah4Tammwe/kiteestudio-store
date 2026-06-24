import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REQUIRED_FIELDS = ['slug', 'name', 'price_gbp'];
const VALID_PRODUCT_TYPES = ['app', 'website', 'document', 'bundle'];
const VALID_STATUSES = ['live', 'draft', 'coming-soon'];

interface BulkRow {
  [key: string]: any;
}

interface RowResult {
  row: number;
  slug: string;
  status: 'created' | 'skipped' | 'error';
  message: string;
}

function validateRow(row: BulkRow, index: number): { ok: boolean; error?: string; cleaned?: BulkRow } {
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] && row[field] !== 0) {
      return { ok: false, error: `Row ${index + 1}: missing required field "${field}"` };
    }
  }

  const slug = String(row.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const price_gbp = Number(row.price_gbp);
  if (isNaN(price_gbp) || price_gbp < 0) {
    return { ok: false, error: `Row ${index + 1}: price_gbp must be a positive number, got "${row.price_gbp}"` };
  }

  const product_type = (row.product_type || 'app').trim().toLowerCase();
  if (!VALID_PRODUCT_TYPES.includes(product_type)) {
    return { ok: false, error: `Row ${index + 1}: product_type "${product_type}" invalid — must be one of ${VALID_PRODUCT_TYPES.join(', ')}` };
  }

  const status = (row.status || 'draft').trim().toLowerCase();
  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, error: `Row ${index + 1}: status "${status}" invalid — must be one of ${VALID_STATUSES.join(', ')}` };
  }

  const sale_price_gbp = row.sale_price_gbp ? Number(row.sale_price_gbp) : undefined;
  if (row.sale_price_gbp && isNaN(sale_price_gbp as number)) {
    return { ok: false, error: `Row ${index + 1}: sale_price_gbp must be a number if provided` };
  }

  const features = typeof row.features === 'string'
    ? row.features.split('|').map((f: string) => f.trim()).filter(Boolean)
    : Array.isArray(row.features) ? row.features : [];

  const cleaned: BulkRow = {
    slug,
    name: String(row.name).trim(),
    tagline: row.tagline ? String(row.tagline).trim() : '',
    description: row.description ? String(row.description).trim() : '',
    price: price_gbp,
    price_gbp,
    sale_price_gbp,
    status,
    product_type,
    category_label: row.category_label ? String(row.category_label).trim() : '',
    category_slug: row.category_slug ? String(row.category_slug).trim() : '',
    stripe_price_id: row.stripe_price_id ? String(row.stripe_price_id).trim() : '',
    seo_title: row.seo_title ? String(row.seo_title).trim() : '',
    seo_description: row.seo_description ? String(row.seo_description).trim() : '',
    file_url: row.file_url ? String(row.file_url).trim() : '',
    image_url: row.image_url ? String(row.image_url).trim() : '',
    drive_folder_url: row.drive_folder_url ? String(row.drive_folder_url).trim() : '',
    features,
  };

  return { ok: true, cleaned };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows: BulkRow[] = body.rows;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 });
  }
  if (rows.length > 200) {
    return NextResponse.json({ error: 'Max 200 rows per batch' }, { status: 400 });
  }

  // Validate every row before inserting anything — fail fast, no partial garbage state from bad parsing
  const validated: { index: number; cleaned: BulkRow }[] = [];
  const preErrors: RowResult[] = [];

  rows.forEach((row, i) => {
    const result = validateRow(row, i);
    if (!result.ok) {
      preErrors.push({ row: i + 1, slug: row.slug || '(unknown)', status: 'error', message: result.error! });
    } else {
      validated.push({ index: i, cleaned: result.cleaned! });
    }
  });

  // Check for duplicate slugs within the batch itself
  const seenSlugs = new Set<string>();
  const dupeFiltered: typeof validated = [];
  validated.forEach(v => {
    if (seenSlugs.has(v.cleaned.slug)) {
      preErrors.push({ row: v.index + 1, slug: v.cleaned.slug, status: 'error', message: `Duplicate slug "${v.cleaned.slug}" appears more than once in this batch` });
    } else {
      seenSlugs.add(v.cleaned.slug);
      dupeFiltered.push(v);
    }
  });

  // Check which slugs already exist in the DB
  const slugsToCheck = dupeFiltered.map(v => v.cleaned.slug);
  const { data: existing } = await supabase.from('products').select('slug').in('slug', slugsToCheck);
  const existingSlugs = new Set((existing || []).map(e => e.slug));

  const toInsert = dupeFiltered.filter(v => !existingSlugs.has(v.cleaned.slug));
  const existingResults: RowResult[] = dupeFiltered
    .filter(v => existingSlugs.has(v.cleaned.slug))
    .map(v => ({ row: v.index + 1, slug: v.cleaned.slug, status: 'skipped', message: `Slug "${v.cleaned.slug}" already exists — skipped. Use the Edit modal to update existing products.` }));

  let insertResults: RowResult[] = [];
  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .insert(toInsert.map(v => v.cleaned))
      .select('slug');

    if (error) {
      // Whole insert failed — report it against every row that was meant to go in
      insertResults = toInsert.map(v => ({ row: v.index + 1, slug: v.cleaned.slug, status: 'error', message: `Insert failed: ${error.message}` }));
    } else {
      insertResults = toInsert.map(v => ({ row: v.index + 1, slug: v.cleaned.slug, status: 'created', message: 'Created' }));
    }
  }

  const allResults = [...preErrors, ...existingResults, ...insertResults].sort((a, b) => a.row - b.row);
  const createdCount = allResults.filter(r => r.status === 'created').length;
  const errorCount = allResults.filter(r => r.status === 'error').length;
  const skippedCount = allResults.filter(r => r.status === 'skipped').length;

  return NextResponse.json({
    summary: { total: rows.length, created: createdCount, skipped: skippedCount, errors: errorCount },
    results: allResults,
  });
}
