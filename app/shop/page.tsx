'use client';
import { useState } from 'react';
import { CATEGORIES, getProductsByCategory, type Category } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [active, setActive] = useState<Category>('all');
  const products = getProductsByCategory(active);

  return (
    <>
      <div className="page-header">
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="1000" cy="100" rx="300" ry="200" fill="#6B1A4A" />
          <ellipse cx="150" cy="220" rx="200" ry="150" fill="#6B1A4A" />
        </svg>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow">Templates</div>
          <h1>All Templates</h1>
          <p>One-page websites with the SiteFill™ editor built in. Choose, fill in your details, publish.</p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 50, background: 'rgba(30,5,22,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: active === c.id ? 'var(--gold)' : 'var(--cream-dim)',
                padding: '18px 18px',
                borderBottom: active === c.id ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '56px 0 96px', background: 'var(--plum-deep)' }}>
        <div className="container">
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>
              {products.length} template{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {products.length === 0 ? (
            <p style={{ color: 'var(--cream-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '60px 0', textAlign: 'center' }}>
              More templates coming soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="shop-grid">
              {products.map(p => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .shop-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .shop-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
