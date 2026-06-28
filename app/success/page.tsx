'use client';
import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import { trackPurchase } from '@/lib/analytics';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    clearCart();

    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    // Guard against double-firing the conversion if the page is refreshed.
    const firedKey = `kt_purchase_fired_${sessionId}`;
    if (sessionStorage.getItem(firedKey)) return;

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        trackPurchase({
          event_id: data.session_id,
          value: data.value,
          currency: data.currency,
          items: data.items,
          email: data.email,
        });
        sessionStorage.setItem(firedKey, '1');
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="600" cy="400" rx="500" ry="380" fill="#6B1A4A" />
      </svg>

      <div style={{ textAlign: 'center', maxWidth: '520px', position: 'relative', zIndex: 2 }}>
        {/* Arch mark */}
        <svg width="60" height="68" viewBox="0 0 60 68" fill="none" style={{ margin: '0 auto 28px' }} xmlns="http://www.w3.org/2000/svg">
          <path d="M2 28C2 13.6 13.6 2 28 2C42.4 2 54 13.6 54 28V66H2V28Z" stroke="#D2AA64" strokeWidth="1.5" fill="none"/>
          <path d="M28 8 L28 18 M28 8 L35 14 M28 8 L21 14 M28 8 L37 9 M28 8 L19 9" stroke="#D2AA64" strokeWidth="1.2"/>
        </svg>

        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '16px' }}>Order confirmed</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 300, lineHeight: 0.95, color: 'var(--cream)', marginBottom: '8px' }}>
          You're all set.
        </h1>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, color: 'var(--gold)', marginBottom: '28px' }}>
          Check your inbox.
        </h2>

        <p style={{ fontSize: '15px', color: 'var(--cream-dim)', lineHeight: 1.85, marginBottom: '44px' }}>
          Your template download link has been sent to your email. If you don't see it within a few minutes, check your spam folder.
        </p>

        <div style={{ background: 'var(--plum-mid)', border: '1px solid var(--border)', padding: '28px', marginBottom: '36px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '18px' }}>Next steps</div>
          {[
            'Open the download link in your email',
            'Save the HTML file to your computer',
            'Open it in your browser — the SiteFill™ editor loads automatically',
            'Fill in your details, add your photos, download your finished site',
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 3 ? '12px' : 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', flexShrink: 0, marginTop: '2px', letterSpacing: '0.08em' }}>0{i + 1}</span>
              <span style={{ fontSize: '14px', color: 'var(--cream-dim)', lineHeight: 1.65 }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn-gold">Browse More Templates</Link>
          <Link href="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
