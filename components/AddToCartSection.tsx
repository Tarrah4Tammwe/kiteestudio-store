'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cartContext';

export default function AddToCartSection({ product: p }: { product: Product }) {
  const { addItem, hasItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);

  const inCart = hasItem(p.slug);

  function handleAdd() {
    if (inCart) return;
    setAdding(true);
    addItem(p);
    setTimeout(() => { setAdding(false); setToast(true); setTimeout(() => setToast(false), 3000); }, 400);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={handleAdd} disabled={inCart || adding} className="btn-gold">
          {adding ? 'Adding...' : inCart ? '✓ In Cart' : 'Add to Cart'}
        </button>
        {inCart && <Link href="/cart" className="btn-outline">View Cart →</Link>}
      </div>
      <div className={`toast${toast ? ' show' : ''}`}>{p.name} added to cart</div>
    </>
  );
}
