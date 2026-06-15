import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  const { data: order, error } = await sb.from('orders').select('*').eq('id', orderId).single();
  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  // Get product file_url
  let fileUrl = order.file_url;
  if (!fileUrl && order.product_id) {
    const { data: product } = await sb.from('products').select('file_url, name').eq('id', order.product_id).single();
    fileUrl = product?.file_url;
  }

  if (!fileUrl) return NextResponse.json({ error: 'No download file attached to this product yet' }, { status: 400 });

  await resend.emails.send({
    from: 'KiTee Studio <hello@kiteestudio.com>',
    to: order.customer_email,
    subject: `Your download: ${order.product_name || 'KiTee Studio'}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #0F1117; color: #F0E8D8;">
        <div style="font-size: 22px; color: #D4AF37; margin-bottom: 8px;">KiTee Studio</div>
        <div style="font-size: 13px; color: #8A7060; margin-bottom: 32px; letter-spacing: 0.1em; text-transform: uppercase;">Your Download Is Ready</div>
        <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
          Hi ${order.customer_name?.split(' ')[0] || 'there'},<br><br>
          Thank you for your purchase. Your copy of <strong style="color: #D4AF37;">${order.product_name || 'your product'}</strong> is ready to download.
        </p>
        <a href="${fileUrl}" style="display: inline-block; background: #D4AF37; color: #0F1117; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 16px 32px; text-decoration: none; margin-bottom: 32px;">
          Download Now →
        </a>
        <p style="font-size: 13px; color: #8A7060; line-height: 1.6;">
          This is your personal download link. Keep this email safe — you can use this link any time to re-download your file.<br><br>
          If you have any questions, reply to this email and we'll get back to you within 24 hours.
        </p>
        <div style="border-top: 1px solid #2A2A2A; margin-top: 40px; padding-top: 20px; font-size: 11px; color: #4A4A4A; font-family: 'Courier New', monospace; letter-spacing: 0.08em;">
          KiTee Studio · kiteestudio.com · Digital tools built to own
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
