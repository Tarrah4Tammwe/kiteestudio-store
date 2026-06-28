import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

function hashForMeta(value?: string | null) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Server-side Purchase event for Meta's Conversions API.
// Skips silently if META_PIXEL_ID / META_CONVERSION_API_TOKEN aren't set —
// this is optional and only activates once those env vars are added.
// event_id matches the client-side dataLayer event on the success page so
// Meta de-duplicates the two signals into a single conversion.
async function sendMetaPurchaseEvent(opts: {
  eventId: string;
  email?: string | null;
  value: number;
  currency: string;
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSION_API_TOKEN;
  if (!pixelId || !accessToken) return;

  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: opts.eventId,
        action_source: 'website',
        event_source_url: process.env.NEXT_PUBLIC_URL,
        user_data: {
          em: opts.email ? [hashForMeta(opts.email)] : undefined,
        },
        custom_data: {
          currency: opts.currency,
          value: opts.value,
        },
      },
    ],
  };

  try {
    await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Meta Conversions API error:', err);
  }
}

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
    const expanded = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });

    for (const item of expanded.line_items?.data || []) {
      const price = item.price as Stripe.Price;
      const stripeProduct = price.product as Stripe.Product;

      // Look up our product by stripe_price_id to get file_url
      const { data: ourProduct } = await supabase
        .from('products')
        .select('id, name, file_url')
        .eq('stripe_price_id', price.id)
        .single();

      // Insert order with correct column names
      const { data: order } = await supabase.from('orders').insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        product_id: ourProduct?.id || null,
        product_name: ourProduct?.name || stripeProduct.name,
        price_id: price.id,
        amount: item.amount_total,          // in pence
        amount_paid: item.amount_total,     // keep both for compatibility
        currency: price.currency,
        status: 'complete',
        download_count: 0,
      }).select().single();

      // Send download email immediately
      if (order && session.customer_details?.email && ourProduct?.file_url) {
        await resend.emails.send({
          from: 'KiTee Studio <hello@kiteestudio.com>',
          to: session.customer_details.email,
          subject: `Your download: ${ourProduct.name}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #0F1117; color: #F0E8D8;">
              <div style="font-size: 22px; color: #D4AF37; margin-bottom: 8px;">KiTee Studio</div>
              <div style="font-size: 13px; color: #8A7060; margin-bottom: 32px; letter-spacing: 0.1em; text-transform: uppercase;">Your Download Is Ready</div>
              <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
                Hi ${session.customer_details.name?.split(' ')[0] || 'there'},<br><br>
                Thank you for your purchase. Your copy of <strong style="color: #D4AF37;">${ourProduct.name}</strong> is ready to download.
              </p>
              <a href="${ourProduct.file_url}" style="display: inline-block; background: #D4AF37; color: #0F1117; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 16px 32px; text-decoration: none; margin-bottom: 32px;">
                Download Now →
              </a>
              <p style="font-size: 13px; color: #8A7060; line-height: 1.6;">
                Keep this email safe — you can use this link to re-download your file any time.<br><br>
                Questions? Reply to this email and we'll get back to you within 24 hours.
              </p>
              <div style="border-top: 1px solid #2A2A2A; margin-top: 40px; padding-top: 20px; font-size: 11px; color: #4A4A4A; font-family: 'Courier New', monospace; letter-spacing: 0.08em;">
                KiTee Studio · kiteestudio.com
              </div>
            </div>
          `,
        });
      }
    }

    // Server-side Purchase conversion (Meta CAPI) — fires once per session
    // using the same event_id as the client-side dataLayer push on the
    // success page, so the two signals de-duplicate into one conversion.
    await sendMetaPurchaseEvent({
      eventId: expanded.id,
      email: expanded.customer_details?.email,
      value: (expanded.amount_total || 0) / 100,
      currency: expanded.currency || 'gbp',
    });
  }

  return NextResponse.json({ received: true });
}
