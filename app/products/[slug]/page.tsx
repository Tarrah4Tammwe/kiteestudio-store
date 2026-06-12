'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/cartContext';
import { useState } from 'react';

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const p = getProductBySlug(slug);
  const { addItem, hasItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);

  if (!p) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--cream)' }}>Template not found</h1>
      <Link href="/shop" className="btn-gold">Back to Shop</Link>
    </div>
  );

  const inCart = hasItem(p.slug);
  const related = PRODUCTS.filter(r => r.category === p.category && r.slug !== p.slug).slice(0, 3);

  function handleAdd() {
    if (inCart) return;
    setAdding(true);
    addItem(p);
    setTimeout(() => { setAdding(false); setToast(true); setTimeout(() => setToast(false), 3000); }, 400);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--plum)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '14px 48px' }}>
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/">Home</Link><span>›</span>
            <Link href="/shop">Templates</Link><span>›</span>
            <span style={{ color: 'var(--cream-dim)' }}>{p.name}</span>
          </nav>
        </div>
      </div>

      {/* Main */}
      <section style={{ padding: '56px 0 96px', background: 'var(--plum-deep)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }} className="product-grid">

            {/* Image */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--plum)', border: '1px solid var(--border-mid)', overflow: 'hidden' }}>
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

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={handleAdd} disabled={inCart || adding} className="btn-gold">
                  {adding ? 'Adding...' : inCart ? '✓ In Cart' : 'Add to Cart'}
                </button>
                {inCart && <Link href="/cart" className="btn-outline">View Cart →</Link>}
              </div>

              <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--cream-muted)' }}>
                Digital product — instant download after purchase. All sales final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '64px 0 96px', background: 'var(--plum)', borderTop: '1px solid var(--border)' }}>
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

      <div className={`toast${toast ? ' show' : ''}`}>{p.name} added to cart</div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
