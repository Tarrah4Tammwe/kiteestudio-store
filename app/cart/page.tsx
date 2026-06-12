'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cartContext';
import { useState } from 'react';

export default function CartPage() {
  const { items, total, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkout() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ priceId: i.product.priceId, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError('Something went wrong. Please try again.'); setLoading(false); }
    } catch { setError('Something went wrong. Please try again.'); setLoading(false); }
  }

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow">Checkout</div>
          <h1>Your Cart</h1>
        </div>
      </div>

      <div style={{ padding: '48px 0 96px', background: 'var(--plum-deep)', minHeight: '60vh' }}>
        <div className="container">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '22px', color: 'var(--cream-dim)', marginBottom: '28px' }}>Your cart is empty</p>
              <Link href="/shop" className="btn-gold">Browse Templates</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px' }} className="cart-layout">

              {/* Items */}
              <div>
                {items.map((item, i) => (
                  <div key={item.product.slug} style={{ display: 'flex', gap: '18px', alignItems: 'center', padding: '22px 0', borderBottom: '1px solid var(--border)', borderTop: i === 0 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '64px', height: '64px', position: 'relative', flexShrink: 0, background: 'var(--plum)', border: '1px solid var(--border)' }}>
                      <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '3px' }}>{item.product.categoryLabel}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--cream)', marginBottom: '2px' }}>{item.product.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.06em' }}>Digital product — instant download</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--gold)', flexShrink: 0 }}>£{item.product.price}</div>
                    <button onClick={() => removeItem(item.product.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-muted)', padding: '8px', transition: 'color 0.2s', flexShrink: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream-dim)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--cream-muted)')}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)', background: 'var(--plum-mid)', border: '1px solid var(--border-mid)', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Order Summary</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {items.map(item => (
                    <div key={item.product.slug} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--cream-dim)', flex: 1 }}>{item.product.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cream)' }}>£{item.product.price}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--gold)' }}>£{total}</span>
                </div>

                {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e06060', marginBottom: '14px' }}>{error}</p>}

                <button onClick={checkout} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '16px', fontSize: '11px' }}>
                  {loading ? 'Redirecting...' : 'Checkout →'}
                </button>

                <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--cream-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                  Secure checkout via Stripe. Digital products. All sales final.
                </p>

                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <Link href="/shop" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--cream-muted)')}>
                    ← Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
