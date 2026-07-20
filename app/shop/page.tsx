import { getLiveProducts } from '@/lib/db';
import ShopClient from '@/components/ShopClient';

export default async function ShopPage() {
  const products = await getLiveProducts();
  return <ShopClient products={products} />;
}
