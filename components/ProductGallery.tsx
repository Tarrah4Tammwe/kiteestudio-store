'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';

export default function ProductGallery({ product: p }: { product: Product }) {
  const images = [p.image, ...(p.gallery || [])];
  const [active, setActive] = useState<number | 'video'>(p.video ? 'video' : 0);

  return (
    <div>
      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--purple-deep)', border: '1px solid var(--border-mid)', overflow: 'hidden' }}>
        {active === 'video' && p.video ? (
          <video
            src={p.video}
            autoPlay loop muted playsInline preload="auto"
            aria-label={`${p.name} demo`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image src={images[typeof active === 'number' ? active : 0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
        )}
        {p.badge && <span className="badge">{p.badge}</span>}
      </div>

      {(images.length > 1 || p.video) && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
          {p.video && (
            <button
              onClick={() => setActive('video')}
              aria-label="Play demo video"
              style={{
                position: 'relative', width: '64px', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer',
                border: active === 'video' ? '2px solid var(--gold-pure)' : '1px solid var(--border-mid)',
                background: 'var(--black-2)', padding: 0,
              }}
            >
              <Image src={images[0]} alt="" fill style={{ objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.35)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#D4AF37"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View screenshot ${i + 1}`}
              style={{
                position: 'relative', width: '64px', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer',
                border: active === i ? '2px solid var(--gold-pure)' : '1px solid var(--border-mid)',
                background: 'var(--black-2)', padding: 0,
              }}
            >
              <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
