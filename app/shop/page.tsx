import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getLiveProducts } from '@/lib/db';
import ShopClient from '@/components/ShopClient';

export const metadata: Metadata = {
  title: 'Shop — Apps & Website Templates',
  description: 'Browse downloadable utility apps and premium SiteFill™ website templates from KiTee Studio. Buy once, own forever, no subscription.',
  alternates: { canonical: 'https://kiteestudio.com/shop' },
  openGraph: {
    title: 'KiTee Studio Shop — Apps & Website Templates',
    description: 'Browse downloadable utility apps and premium SiteFill™ website templates. Buy once, own forever, no subscription.',
    url: 'https://kiteestudio.com/shop',
    type: 'website',
  },
};

export default async function ShopPage() {
  const products = await getLiveProducts();
  return (
    <Suspense fallback={null}>
      <ShopClient products={products} />
    </Suspense>
  );
}
