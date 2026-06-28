import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Used by the success page to pull real order value/currency/items for
// ad-platform conversion tracking (Meta Pixel, Google Ads, etc. via GTM).
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    });

    const items = (session.line_items?.data || []).map((item) => {
      const price = item.price as Stripe.Price | null;
      const product = price?.product as Stripe.Product | undefined;
      return {
        item_name: product?.name || 'Product',
        price: (item.amount_total || 0) / 100,
        quantity: item.quantity || 1,
      };
    });

    return NextResponse.json({
      session_id: session.id,
      value: (session.amount_total || 0) / 100,
      currency: session.currency,
      email: session.customer_details?.email || null,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
