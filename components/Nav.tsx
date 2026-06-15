'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import { useState, useEffect } from 'react';

export default function Nav() {
  const { count } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop#apps', label: 'Apps' },
    { href: '/shop#templates', label: 'Templates' },
    { href: '/#why', label: 'About' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--nav-h)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        background: scrolled ? 'rgba(6,3,10,0.97)' : 'rgba(6,3,10,0.82)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(210,170,100,0.2)',
        transition: 'background 0.3s',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14C1 6.8 6.8 1 14 1C21.2 1 27 6.8 27 14V31H1V14Z" stroke="#D2AA64" strokeWidth="1.2" fill="none"/>
            <line x1="14" y1="5" x2="14" y2="9.5" stroke="#D2AA64" strokeWidth="1"/>
            <line x1="14" y1="5" x2="17.5" y2="8" stroke="#D2AA64" strokeWidth="1"/>
            <line x1="14" y1="5" x2="10.5" y2="8" stroke="#D2AA64" strokeWidth="1"/>
            <line x1="14" y1="5" x2="18" y2="5.5" stroke="#D2AA64" strokeWidth="0.8"/>
            <line x1="14" y1="5" x2="10" y2="5.5" stroke="#D2AA64" strokeWidth="0.8"/>
            <line x1="14" y1="5" x2="14.5" y2="1.5" stroke="#D2AA64" strokeWidth="0.8"/>
            <line x1="14" y1="5" x2="13.5" y2="1.5" stroke="#D2AA64" strokeWidth="0.8"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.02em', lineHeight: 1.1 }}>KiTee</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dim)', lineHeight: 1 }}>Studio</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-desktop">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: pathname.startsWith(l.href.split('#')[0]) && l.href !== '/#why' ? 'var(--gold)' : 'var(--cream-dim)',
              transition: 'color 0.2s',
            }}>
              {l.label}
            </Link>
          ))}

          <Link href="/cart" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: pathname === '/cart' ? 'var(--gold)' : 'var(--cream-dim)',
            transition: 'color 0.2s',
          }}>
            Cart
            {count > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '17px', height: '17px', borderRadius: '50%', background: 'var(--gold)', color: 'var(--plum-deep)', fontSize: '9px', fontWeight: 700 }}>{count}</span>
            )}
          </Link>

          <Link href="/shop" className="btn-gold" style={{ padding: '10px 22px', fontSize: '10px' }}>Shop Now</Link>
        </div>

        {/* Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} className="nav-mobile">
          <Link href="/cart" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cream-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Cart {count > 0 && <span style={{ background: 'var(--gold)', color: 'var(--plum-deep)', width: '15px', height: '15px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700 }}>{count}</span>}
          </Link>
          <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '20px', height: '1px', background: 'var(--gold)', transition: 'all 0.2s', transform: open ? (i===0?'rotate(45deg) translateY(6px)':i===1?'scaleX(0)':'rotate(-45deg) translateY(-6px)'):'none' }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: 'fixed', top: 'var(--nav-h)', inset: '0', background: 'var(--black-2)', zIndex: 99, display: 'flex', flexDirection: 'column', padding: '48px 20px', borderTop: '1px solid var(--border)' }}>
          {[...navLinks, { href: '/cart', label: 'Cart' }].map(l => (
            <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 300, color: 'var(--cream)', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile  { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  );
}
