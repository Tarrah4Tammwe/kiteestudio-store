'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--plum)', borderTop: '1px solid var(--border)', padding: '64px 0 36px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '56px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }} className="footer-grid">

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, color: 'var(--gold)', marginBottom: '12px' }}>KiTee Studio</div>
            <p style={{ fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.85, maxWidth: '300px' }}>
              Premium one-page website templates for freelancers, coaches, authors, and creators.
              Download, fill in your details, publish.
            </p>
            <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dim)', letterSpacing: '0.1em' }}>
              One purchase. Own it forever.
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Templates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['/products/life-coach-website-template', 'Life Coach'],
                ['/products/freelancer-website-template', 'Freelancer'],
                ['/products/author-website-template', 'Author'],
                ['/products/podcast-website-template', 'Podcast'],
                ['/products/shop-website-template', 'Shop & Artisan'],
                ['/products/personal-trainer-website-template', 'Personal Trainer'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[['/shop', 'All Templates'], ['/about', 'About KiTee Studio']].map(([href, label]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.08em' }}>
            © {new Date().getFullYear()} KiTee Studio. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.08em' }}>
            Digital products only. All sales final.
          </span>
        </div>
      </div>
      <style>{`
        .footer-link { font-size: 13px; color: var(--cream-dim); transition: color 0.2s; }
        .footer-link:hover { color: var(--gold); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
