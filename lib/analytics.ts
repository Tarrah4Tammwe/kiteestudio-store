// Lightweight dataLayer helper for ecommerce tracking through GTM.
// Any tag inside the GTM container (Meta Pixel, Google Ads, Pinterest, etc.)
// can listen for these events without further code changes.

type PurchaseItem = {
  item_name: string;
  price: number;
  quantity?: number;
};

export function trackPurchase(data: {
  event_id: string;
  value: number;
  currency: string;
  items: PurchaseItem[];
  email?: string | null;
}) {
  if (typeof window === 'undefined') return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'purchase',
    // event_id lets the GTM Meta/Google tags de-duplicate against the
    // server-side conversion fired from the Stripe webhook (same id used there).
    event_id: data.event_id,
    ecommerce: {
      transaction_id: data.event_id,
      currency: data.currency,
      value: data.value,
      items: data.items,
    },
  });
}
