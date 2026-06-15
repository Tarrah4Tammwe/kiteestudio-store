'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--black-3)', borderTop: '1px solid var(--border)', padding: '64px 0 36px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid var(--border)' }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, color: 'var(--gold)', marginBottom: '12px' }}>KiTee Studio</div>
            <p style={{ fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.85, maxWidth: '280px', marginBottom: '20px' }}>
              Downloadable utility apps and premium website templates. No subscriptions. Buy once — yours forever.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-dim)', letterSpacing: '0.1em', marginBottom: '20px' }}>
              Built by a neurodivergent brain. For every brain.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: 'LinkedIn', href: 'https://linkedin.com/in/tarrah-nhari' },
                { label: 'Substack', href: 'https://kiteestudio.substack.com' },
                { label: 'TikTok', href: 'https://tiktok.com/@kiteestudio' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--gold)',
                  border: '1px solid var(--border)', padding: '6px 12px',
                  transition: 'border-color 0.2s',
                }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Apps */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Utility Apps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['/products/burnout-recovery-blueprint', 'Burnout Recovery Blueprint'],
                ['/products/post-diagnosis-rebuild-kit', 'Post-Diagnosis Rebuild Kit'],
                ['/products/gym-tracker', 'Gym Tracker'],
                ['/shop#apps', 'All Apps →'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>SiteFill™ Templates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['/products/life-coach-website-template', 'Life Coach'],
                ['/products/freelancer-website-template', 'Freelancer'],
                ['/products/author-website-template', 'Author'],
                ['/products/podcast-website-template', 'Podcast'],
                ['/shop#templates', 'All Templates →'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['/', 'Studio'],
                ['/shop', 'Shop All'],
                ['/#why', 'About KiTee Studio'],
              ].map(([href, label]) => (
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
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
