import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((i: { priceId: string; quantity: number }) => ({ price: i.priceId, quantity: i.quantity })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: { source: 'kiteestudio-store' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
