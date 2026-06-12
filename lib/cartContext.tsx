'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from './products';

export type CartItem = { product: Product; quantity: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (p: Product) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  hasItem: (slug: string) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('ks_cart');
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('ks_cart', JSON.stringify(items));
  }, [items]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  function addItem(p: Product) {
    setItems(prev => prev.find(i => i.product.slug === p.slug) ? prev : [...prev, { product: p, quantity: 1 }]);
  }
  function removeItem(slug: string) { setItems(p => p.filter(i => i.product.slug !== slug)); }
  function clearCart() { setItems([]); localStorage.removeItem('ks_cart'); }
  function hasItem(slug: string) { return items.some(i => i.product.slug === slug); }

  return <Ctx.Provider value={{ items, count, total, addItem, removeItem, clearCart, hasItem }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
