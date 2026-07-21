import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GoogleTagManager from '@/components/GoogleTagManager';

// Re-checks admin-managed settings (e.g. GTM ID under Settings → Ads & Tracking)
// at most once a minute, so changes made in the admin panel go live without
// a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://kiteestudio.com'),
  title: { template: '%s — KiTee Studio', default: 'KiTee Studio — Premium Website Templates' },
  description: 'Premium one-page website templates for freelancers, coaches, authors, and creators. Download, customise, publish — no code needed.',
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'KiTee Studio — Premium Website Templates',
    description: 'Downloadable utility apps and premium website templates. No subscriptions. Buy once, own forever.',
  },
  other: {
    'p:domain_verify': 'aa93db1fd27e9dcb353c7a77ebcfb8c8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleTagManager />
        <CartProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
