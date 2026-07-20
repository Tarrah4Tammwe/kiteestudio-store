import { createClient } from '@supabase/supabase-js';
import { PRODUCTS, type Product } from './products';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type DbProductRow = {
  slug: string;
  price_gbp: number | null;
  sale_price_gbp: number | null;
  stripe_price_id: string | null;
  status: string | null;
};

// Price, sale price, Stripe price ID and live/draft status are managed from
// Admin -> Products and live in Supabase. Everything else (name, images,
// features, copy) still comes from the curated catalogue in products.ts.
// This overlays the admin-managed fields onto that catalogue by slug, so
// changing a price in the admin panel takes effect on the storefront
// immediately with no redeploy. Falls back to the static catalogue
// untouched if Supabase is unreachable or a product has no matching row yet.
export async function getLiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug, price_gbp, sale_price_gbp, stripe_price_id, status');
    if (error || !data) return PRODUCTS;

    const bySlug = new Map<string, DbProductRow>(data.map((row: DbProductRow) => [row.slug, row]));

    return PRODUCTS.map(p => {
      const row = bySlug.get(p.slug);
      if (!row) return p;
      return {
        ...p,
        price: row.sale_price_gbp ?? row.price_gbp ?? p.price,
        priceId: row.stripe_price_id || p.priceId,
        status: (row.status === 'live' || row.status === 'coming-soon') ? row.status : p.status,
      };
    });
  } catch {
    return PRODUCTS;
  }
}

export async function getLiveProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getLiveProducts();
  return products.find(p => p.slug === slug);
}
