import { NextRequest, NextResponse } from 'next/server';

// This route generates Etsy + Gumroad listing copy for a product using the
// Anthropic API, following the KiTee Studio listing standard. It returns
// markdown text — the admin UI is responsible for writing it into the
// product's Google Drive subfolder via the Drive connector, since this
// route has no Drive credentials of its own.

const SYSTEM_PROMPT = `You write Etsy and Gumroad listing copy for KiTee Studio, a boutique digital products studio.

KiTee Studio sells two product lines:
1. SiteFill website templates (one-time purchase, visual editor, for coaches/authors/freelancers/personal trainers/podcasters/shop sellers)
2. Self-contained downloadable mini-apps (phone/tablet-first HTML/CSS/JS, offline, localStorage, no login, no subscription)

Core positioning rules you must follow exactly:
- "Not a workbook, not a PDF" — this differentiation framing is mandatory for any mini-app.
- Buy-once-own-forever as the explicit alternative to the subscription economy.
- Open every description with the pain point, never with a feature list.
- Etsy SEO intersects with Google search — weave natural-language search phrases into the body, not just the tag list.
- Etsy tags: exactly 13 tags, each 20 characters or fewer, no exceptions.
- For AuDHD-specific products: say "AuDHD" (autism + ADHD combined), never "ADHD" alone.
- Tone: direct, warm, zero corporate fluff, zero hype-bro energy.

Output ONLY valid markdown with these exact sections, nothing before or after:

# ETSY LISTING

## Title
(under 140 characters, problem-first, keyword-led)

## Tags (13, each ≤20 chars)
1. ...
(through 13)

## Description
(opens with pain point, structured with the natural-language SEO phrases woven in, includes "not a workbook, not a PDF" framing if it's a mini-app, ends with a clear buy-once-own-forever close)

---

# GUMROAD LISTING

## Title

## Description
(can reuse most of the Etsy description but adjust framing slightly since Gumroad audience is less search-driven and more direct-link/social-driven)

---

# SUMMARY
One line confirming product name and price for the person doing the upload.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, tagline, description, price_gbp, product_type, category_label, features } = body;

  if (!name) {
    return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
  }

  const priceUsd = price_gbp ? Math.round(price_gbp * 1.27) : null; // rough GBP->USD for Etsy/Gumroad display, person should verify at time of listing

  const userPrompt = `Generate the full Etsy + Gumroad listing for this KiTee Studio product:

Name: ${name}
Tagline: ${tagline || '(none provided)'}
Internal description: ${description || '(none provided)'}
Product type: ${product_type || 'app'}
Category: ${category_label || '(none provided)'}
Features: ${Array.isArray(features) && features.length ? features.join(', ') : '(none provided)'}
Price: £${price_gbp || '?'} (approx $${priceUsd || '?'} USD — verify current rate before publishing)`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    const textBlock = (data.content || []).find((b: any) => b.type === 'text');
    if (!textBlock) {
      return NextResponse.json({ error: 'No listing text returned from generation' }, { status: 500 });
    }

    return NextResponse.json({ markdown: textBlock.text });
  } catch (err: any) {
    return NextResponse.json({ error: `Generation failed: ${err.message}` }, { status: 500 });
  }
}
