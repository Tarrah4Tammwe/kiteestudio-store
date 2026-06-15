import Link from 'next/link';
import type { Metadata } from 'next';
import { PRODUCTS, APP_CATEGORIES, getAppsByCategory } from '@/lib/products';

export const metadata: Metadata = {
  title: 'KiTee Studio — Downloadable Apps & Website Templates',
  description: 'KiTee Studio builds downloadable utility apps and premium website templates. No subscriptions. Buy once, own forever. Built by a neurodivergent brain for every brain.',
  openGraph: {
    title: 'KiTee Studio — Tools Built for Real Life',
    description: 'Downloadable utility apps and premium website templates. No subscriptions. Buy once, own forever.',
    url: 'https://kiteestudio.com',
    siteName: 'KiTee Studio',
    type: 'website',
  },
};

const liveApps = PRODUCTS.filter(p => p.productType === 'app' && p.status === 'live');
const liveTemplates = PRODUCTS.filter(p => p.productType === 'template' && p.status === 'live');

const marqueeItems = ['AuDHD Tools', '✦', 'Gym Tracker', '✦', 'Website Templates', '✦', 'Offline Apps', '✦', 'No Subscriptions', '✦', 'Buy Once Own Forever', '✦', 'AuDHD Tools', '✦', 'Gym Tracker', '✦', 'Website Templates', '✦', 'Offline Apps', '✦', 'No Subscriptions', '✦', 'Buy Once Own Forever', '✦'];

export default function HomePage() {
  return (
    <>
      {/* ── JSON-LD structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'KiTee Studio',
          url: 'https://kiteestudio.com',
          description: 'Downloadable utility apps and premium website templates. No subscriptions. Buy once, own forever.',
          founder: { '@type': 'Person', name: 'Tarrah' },
          sameAs: [
            'https://www.linkedin.com/in/tarrah-nhari',
            'https://kiteestudio.substack.com',
          ],
        })}}
      />

      {/* ── HERO — Studio landing ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, var(--plum-deep) 0%, var(--purple) 55%, var(--black-2) 100%)',
        paddingTop: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Decorative blobs */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="950" cy="180" rx="380" ry="300" fill="#6B1A4A" opacity="0.15"/>
          <ellipse cx="150" cy="650" rx="260" ry="220" fill="#3D1554" opacity="0.2"/>
        </svg>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%)', pointerEvents: 'none' }}/>

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '80px 48px' }}>
          <div style={{ maxWidth: '760px' }}>
            <div className="eyebrow">KiTee Studio — Digital Products</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,7vw,100px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '0.01em', color: 'var(--cream)', marginBottom: '8px' }}>
              I find the problem.
            </h1>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(52px,7vw,100px)', fontWeight: 400, lineHeight: 1, color: 'var(--gold-pure)', marginBottom: '40px', textShadow: '0 0 60px rgba(212,175,55,0.2)' }}>
              Then I build the fix.
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--cream-dim)', lineHeight: 1.8, maxWidth: '520px', marginBottom: '48px' }}>
              KiTee Studio makes downloadable utility apps and website templates.
              No subscriptions. No scatter. Buy once — it&apos;s yours, forever.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/shop" className="btn-gold">Browse the Shop</Link>
              <Link href="#why" className="btn-ghost">Why KiTee Studio →</Link>
            </div>

            {/* Stats */}
            <div style={{ marginTop: '56px', paddingTop: '36px', borderTop: '1px solid var(--border)', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                ['0', 'Subscriptions required'],
                [`${liveApps.length}+`, 'Apps available now'],
                ['∞', 'Yours to keep'],
              ].map(([v, l]) => (
                <div key={v}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--gold-pure)', lineHeight: 1, marginBottom: '4px' }}>{v}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={item === '✦' ? 'sep' : ''}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── WHY THIS EXISTS ── */}
      <section id="why" style={{ padding: '96px 0', background: 'var(--black-3)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="why-grid">
            <div>
              <div className="eyebrow">Why KiTee Studio exists</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '28px' }}>
                The PDFs weren&apos;t <em style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>cutting it.</em>
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--cream-dim)', lineHeight: 1.85, marginBottom: '20px' }}>
                I got an AuDHD diagnosis and went looking for tools. I found Notion templates, PDF workbooks, worksheets — all scattered across five apps, three subscriptions, and a folder I kept forgetting to open.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--cream-dim)', lineHeight: 1.85, marginBottom: '20px' }}>
                So I started building what I actually needed: <strong style={{ color: 'var(--cream)' }}>single-file utility apps</strong> that live on your phone, work offline, and are yours to keep. No account. No monthly fee. No syncing to someone else&apos;s server.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--cream-dim)', lineHeight: 1.85 }}>
                And then I realised — this isn&apos;t just an AuDHD problem. Everyone deserves tools that actually work. That&apos;s what I build here.
              </p>
            </div>

            {/* Founder card */}
            <div>
              <div style={{ background: 'var(--purple-deep)', border: '1px solid var(--border)', padding: '40px', marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.5, marginBottom: '24px', borderLeft: '2px solid var(--gold)', paddingLeft: '20px' }}>
                  &ldquo;My niche is literally problem solving. I find the problem, I build the fix — and I&apos;ve got a lot of problems I&apos;ve already solved that need to be in the world.&rdquo;
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--plum)', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--gold)', flexShrink: 0 }}>T</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream)', marginBottom: '4px' }}>Tarrah — Founder</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--cream-muted)' }}>AuDHD. Builder. Problem gremlin.</div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/tarrah-nhari' },
                  { label: 'Substack', href: 'https://kiteestudio.substack.com' },
                  { label: 'TikTok', href: 'https://tiktok.com/@kiteestudio' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--gold)',
                    border: '1px solid var(--border-mid)', padding: '8px 14px',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}>
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT DIFFERENT — 3 pillars ── */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(180deg, var(--cold-deep) 0%, var(--cold) 100%)', borderBottom: '1px solid var(--border-cold)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Built different</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'var(--cream)' }}>
              Three things that <em style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>never change.</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px' }} className="pillars-grid">
            {[
              { n: '01', title: 'Yours. Full stop.', body: 'Pay once. Download the file. It lives on your device forever. No account to lose, no server to go down, no price hike in six months.' },
              { n: '02', title: 'Offline, always.', body: 'Every utility app works completely offline. Great signal or underground on the Tube — it just works. No Wi-Fi dependency, ever.' },
              { n: '03', title: 'Built by this brain.', body: 'AuDHD-built means nothing is fluff. Every tap target, every feature exists because it solves a real friction. If it annoyed me, it got fixed.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ background: 'rgba(14,19,36,0.7)', border: '1px solid var(--border-cold)', padding: '48px 36px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {n}<span style={{ flex: 1, height: '1px', background: 'var(--border-cold)', maxWidth: '36px', display: 'block' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, color: 'var(--cream)', marginBottom: '14px', lineHeight: 1.2 }}>{title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--cream-dim)', lineHeight: 1.85 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UTILITY APPS PREVIEW ── */}
      <section style={{ padding: '96px 0', background: 'var(--black)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="eyebrow">Utility Apps</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
                Tools that do one job <em style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>brilliantly.</em>
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--cream-dim)', marginTop: '12px', maxWidth: '480px', lineHeight: 1.7 }}>
                Single-file HTML apps. Download, open in any browser, use forever. Phone and tablet first.
              </p>
            </div>
            <Link href="/shop#apps" className="btn-outline">All Apps →</Link>
          </div>

          {/* App category previews */}
          {APP_CATEGORIES.map(cat => {
            const apps = getAppsByCategory(cat.id);
            if (apps.length === 0) return null;
            return (
              <div key={cat.id} style={{ marginBottom: '56px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>{cat.label}</span>
                  <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <Link href={`/shop#${cat.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>
                    View all →
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }} className="grid-3">
                  {apps.slice(0, 3).map(p => (
                    <Link key={p.slug} href={`/products/${p.slug}`} style={{ background: 'var(--black-3)', border: '1px solid var(--border)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.3s', textDecoration: 'none' }} className="app-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>App</span>
                        {p.status === 'live' ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid var(--border-mid)', padding: '3px 8px' }}>Live</span>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(60,10,40,0.4)', color: 'var(--cream-muted)', border: '1px solid var(--border)', padding: '3px 8px' }}>Coming soon</span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--cream)', lineHeight: 1.2 }}>{p.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.7, flex: 1 }}>{p.tagline}</div>
                      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                        {p.status === 'live' ? 'Get it →' : 'Notify me →'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TEMPLATES PREVIEW ── */}
      <section style={{ padding: '96px 0', background: 'var(--purple-deep)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '52px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="eyebrow">SiteFill™ Templates</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1 }}>
                Website templates. <em style={{ fontStyle: 'italic', color: 'var(--gold-pure)' }}>Edit and go.</em>
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--cream-dim)', marginTop: '12px', maxWidth: '480px', lineHeight: 1.7 }}>
                One-page sites for coaches, creators, and freelancers. Open the file, fill in your details, download your finished site.
              </p>
            </div>
            <Link href="/shop#templates" className="btn-outline">All Templates →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }} className="grid-4">
            {liveTemplates.slice(0, 4).map(p => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
                <div className="product-card-img" style={{ aspectRatio: '4/3' }}>
                  {p.badge && <span className="badge">{p.badge}</span>}
                  <div style={{ width: '100%', height: '100%', background: 'var(--black-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--gold-dim)', textTransform: 'uppercase' }}>{p.categoryLabel}</span>
                  </div>
                </div>
                <div className="product-card-body">
                  <div className="product-card-cat">{p.categoryLabel}</div>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-tagline">{p.tagline}</div>
                  <div className="product-card-footer">
                    <span className="product-card-price" style={{ fontSize: '14px', color: 'var(--gold)' }}>SiteFill™</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'linear-gradient(160deg,var(--plum) 0%,var(--purple-mid) 100%)', borderTop: '1px solid var(--border)', padding: '96px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(212,175,55,0.08) 0%,transparent 70%)', pointerEvents: 'none' }}/>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Ready?</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 300, color: 'var(--cream)', marginBottom: '18px' }}>
            Find your tool.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--cream-dim)', marginBottom: '40px', maxWidth: '420px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            Apps and templates built for real life. Buy once, no subscription, yours forever.
          </p>
          <Link href="/shop" className="btn-gold">Browse the Shop</Link>
        </div>
      </section>

      <style>{`
        .why-grid { grid-template-columns: 1fr 1fr !important; }
        .pillars-grid { grid-template-columns: repeat(3,1fr) !important; }
        .app-card:hover { border-color: var(--gold-dim) !important; }
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

