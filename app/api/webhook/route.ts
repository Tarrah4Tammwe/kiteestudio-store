import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const expanded = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items.data.price.product'] });

    for (const item of expanded.line_items?.data || []) {
      const price = item.price as Stripe.Price;
      const product = price.product as Stripe.Product;
      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        product_id: product.id,
        product_name: product.name,
        price_id: price.id,
        amount: item.amount_total,
        currency: price.currency,
        status: 'completed',
      });
      // TODO: send download email via Resend
    }
  }

  return NextResponse.json({ received: true });
}
