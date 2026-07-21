import type { MetadataRoute } from 'next';
import { getLiveProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://kiteestudio.com';
  const products = await getLiveProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    .filter(p => p.status === 'live')
    .map(p => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...productRoutes];
}
