import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getLiveProductBySlug, getLiveProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import AddToCartSection from '@/components/AddToCartSection';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getLiveProductBySlug(slug);
  if (!p) return { title: 'Template not found' };

  const title = p.seoTitle || `${p.name} — SiteFill™ by KiTee Studio`;
  const description = p.seoDescription || p.tagline;
  const url = `https://kiteestudio.com/products/${p.slug}`;
  const image = `https://kiteestudio.com${p.image}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: image, width: 900, height: 900, alt: p.name }], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getLiveProductBySlug(slug);

  if (!p) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--cream)' }}>Template not found</h1>
      <Link href="/shop" className="btn-gold">Back to Shop</Link>
    </div>
  );

  const allProducts = await getLiveProducts();
  const related = allProducts.filter(r => r.category === p.category && r.slug !== p.slug).slice(0, 3);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.seoDescription || p.description,
    image: `https://kiteestudio.com${p.image}`,
    brand: { '@type': 'Brand', name: 'KiTee Studio' },
    offers: {
      '@type': 'Offer',
      url: `https://kiteestudio.com/products/${p.slug}`,
      priceCurrency: 'GBP',
      price: p.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        // Escaping "<" prevents the browser from parsing "</script>" or "<!--"
        // sequences inside the JSON early, which desyncs SSR output from what
        // React expects to hydrate.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumb */}
      <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--purple-deep)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '14px 48px' }}>
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/">Home</Link><span>›</span>
            <Link href="/shop">Templates</Link><span>›</span>
            <span style={{ color: 'var(--cream-dim)' }}>{p.name}</span>
          </nav>
        </div>
      </div>

      {/* Main */}
      <section style={{ padding: '56px 0 96px', background: 'var(--black)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }} className="product-grid">

            {/* Image */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--purple-deep)', border: '1px solid var(--border-mid)', overflow: 'hidden' }}>
                <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                {p.badge && <span className="badge">{p.badge}</span>}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="eyebrow">{p.categoryLabel}</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: '12px' }}>
                {p.name}
              </h1>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', color: 'var(--gold)', marginBottom: '24px' }}>
                {p.tagline}
              </p>
              <p style={{ fontSize: '15px', color: 'var(--cream-dim)', lineHeight: 1.85, marginBottom: '36px', maxWidth: '480px' }}>
                {p.description}
              </p>

              {/* Features */}
              <div style={{ background: 'var(--plum-mid)', border: '1px solid var(--border)', padding: '28px', marginBottom: '32px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
                  What's included
                </div>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < p.features.length - 1 ? '12px' : 0 }}>
                    <span style={{ color: 'var(--gold)', marginTop: '3px', fontSize: '12px', flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: '14px', color: 'var(--cream-dim)', lineHeight: 1.65 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 600, color: 'var(--gold)', lineHeight: 1 }}>
                  £{p.price}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--cream-muted)', textTransform: 'uppercase' }}>
                  One-time · Yours forever
                </span>
              </div>

              <AddToCartSection product={p} />

              <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--cream-muted)' }}>
                Digital product — instant download after purchase. All sales final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '64px 0 96px', background: 'var(--purple-deep)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: '12px' }}>More like this</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--cream)', marginBottom: '36px' }}>
              You might also like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }} className="related-grid">
              {related.map(r => <ProductCard key={r.slug} product={r} />)}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
