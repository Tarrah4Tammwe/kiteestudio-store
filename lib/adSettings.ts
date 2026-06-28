import { createClient } from '@supabase/supabase-js';

// Ads/tracking config is admin-editable (Admin → Settings → Ads & Tracking),
// stored in the same `site_settings` key-value table as the rest of the
// site copy. Env vars (.env.example) remain as a fallback for first deploy
// or if the DB read fails — but the admin panel is the source of truth
// once values are saved there, and changes apply without a redeploy.

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type AdSettings = {
  gtmId?: string;
  metaPixelId?: string;
  metaCapiToken?: string;
};

export async function getAdSettings(): Promise<AdSettings> {
  try {
    const { data } = await sb
      .from('site_settings')
      .select('key, value')
      .in('key', ['gtm_id', 'meta_pixel_id', 'meta_capi_token']);

    const map: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      map[row.key] = row.value;
    });

    return {
      gtmId: map.gtm_id || process.env.NEXT_PUBLIC_GTM_ID || undefined,
      metaPixelId: map.meta_pixel_id || process.env.META_PIXEL_ID || undefined,
      metaCapiToken: map.meta_capi_token || process.env.META_CONVERSION_API_TOKEN || undefined,
    };
  } catch {
    // DB unreachable — fall back to env vars rather than breaking the page.
    return {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || undefined,
      metaPixelId: process.env.META_PIXEL_ID || undefined,
      metaCapiToken: process.env.META_CONVERSION_API_TOKEN || undefined,
    };
  }
}
