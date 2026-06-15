'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, APP_CATEGORIES, TEMPLATE_CATEGORIES, getAppsByCategory } from '@/lib/products';

type Filter = 'all' | 'apps' | 'templates';

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const showApps = filter === 'all' || filter === 'apps';
  const showTemplates = filter === 'all' || filter === 'templates';
  const templates = PRODUCTS.filter(p => p.productType === 'template');

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="1000" cy="100" rx="300" ry="200" fill="#6B1A4A" />
          <ellipse cx="150" cy="220" rx="200" ry="150" fill="#6B1A4A" />
        </svg>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow">The Shop</div>
          <h1>Apps & Templates</h1>
          <p>Downloadable utility apps and premium website templates. Buy once, own forever, no subscription.</p>
        </div>
      </div>

      {/* Sticky top-level filter */}
      <div style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 50, background: 'rgba(6,3,10,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0' }}>
            {([['all', 'Everything'], ['apps', 'Utility Apps'], ['templates', 'SiteFill™ Templates']] as [Filter, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: filter === id ? 'var(--gold)' : 'var(--cream-dim)',
                padding: '18px 20px',
                borderBottom: filter === id ? '2px solid var(--gold-pure)' : '2px solid transparent',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--black)', paddingBottom: '96px' }}>

        {/* ── UTILITY APPS ── */}
        {showApps && (
          <div id="apps" style={{ paddingTop: '72px' }}>
            <div className="container">
              <div style={{ marginBottom: '56px' }}>
                <div className="eyebrow">Utility Apps</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '12px' }}>
                  Download. Open. Use forever.
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--cream-dim)', maxWidth: '520px', lineHeight: 1.7 }}>
                  Self-contained HTML apps. No internet needed. No account. No subscription. Works on any phone, tablet, or browser.
                </p>
              </div>

              {/* One section per app category */}
              {APP_CATEGORIES.map(cat => {
                const apps = getAppsByCategory(cat.id);
                const allAppsInCat = PRODUCTS.filter(p => p.productType === 'app' && p.categorySlug === cat.id);
                if (allAppsInCat.length === 0) return null;

                return (
                  <div key={cat.id} id={cat.id} style={{ marginBottom: '72px' }}>
                    {/* Category header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>{cat.label}</div>
                        <p style={{ fontSize: '12px', color: 'var(--cream-muted)' }}>{cat.description}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }} className="grid-3">
                      {allAppsInCat.map(p => (
                        p.status === 'live' ? (
                          <Link key={p.slug} href={`/products/${p.slug}`} style={{ background: 'var(--black-3)', border: '1px solid var(--border)', padding: '28px 24px', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s, transform 0.2s', textDecoration: 'none' }} className="app-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>{cat.label}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-mid)', padding: '3px 8px' }}>Live</span>
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '10px' }}>{p.name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.75, flex: 1, marginBottom: '20px' }}>{p.tagline}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.08em' }}>Price set by admin</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>Get it →</span>
                            </div>
                          </Link>
                        ) : (
                          <div key={p.slug} style={{ background: 'var(--black-3)', border: '1px solid var(--border)', padding: '28px 24px', display: 'flex', flexDirection: 'column', opacity: 0.55 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>{cat.label}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(60,10,40,0.4)', color: 'var(--cream-muted)', border: '1px solid var(--border)', padding: '3px 8px' }}>Coming soon</span>
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '10px' }}>{p.name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.75, flex: 1 }}>{p.tagline}</div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SITEFILL TEMPLATES ── */}
        {showTemplates && (
          <div id="templates" style={{ paddingTop: showApps ? '40px' : '72px', borderTop: showApps ? '1px solid var(--border)' : 'none' }}>
            <div className="container">
              <div style={{ marginBottom: '56px' }}>
                <div className="eyebrow">SiteFill™ Templates</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '12px' }}>
                  One-page websites. <em style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>Edit and go.</em>
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--cream-dim)', maxWidth: '520px', lineHeight: 1.7 }}>
                  Open the file, fill in your details, download your finished site. The SiteFill™ editor is built right in — no design software, no code.
                </p>
              </div>

              {/* Group by template category */}
              {TEMPLATE_CATEGORIES.map(cat => {
                const catTemplates = templates.filter(p => p.categorySlug === cat.id);
                if (catTemplates.length === 0) return null;
                return (
                  <div key={cat.id} id={`template-${cat.id}`} style={{ marginBottom: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>{cat.label}</span>
                      <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }} className="grid-3">
                      {catTemplates.map(p => (
                        <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
                          <div className="product-card-img">
                            {p.badge && <span className="badge">{p.badge}</span>}
                            <div style={{ width: '100%', height: '100%', background: 'var(--black-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--gold-dim)', textTransform: 'uppercase' }}>Preview</span>
                            </div>
                          </div>
                          <div className="product-card-body">
                            <div className="product-card-cat">{p.categoryLabel}</div>
                            <div className="product-card-name">{p.name}</div>
                            <div className="product-card-tagline">{p.tagline}</div>
                            <div className="product-card-footer">
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.08em' }}>SiteFill™</span>
                              <span className="product-card-cta">View →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .app-card:hover { border-color: var(--gold-dim) !important; transform: translateY(-4px); }
        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
