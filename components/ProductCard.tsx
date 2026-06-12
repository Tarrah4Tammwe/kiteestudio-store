import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/products';

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link href={`/products/${p.slug}`} className="product-card">
      <div className="product-card-img">
        <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
        {p.badge && <span className="badge">{p.badge}</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-cat">{p.categoryLabel}</div>
        <div className="product-card-name">{p.name}</div>
        <div className="product-card-tagline">{p.tagline}</div>
        <div className="product-card-footer">
          <span className="product-card-price">£{p.price}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
