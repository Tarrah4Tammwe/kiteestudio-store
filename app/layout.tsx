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
  title: { template: '%s — KiTee Studio', default: 'KiTee Studio — Premium Website Templates' },
  description: 'Premium one-page website templates for freelancers, coaches, authors, and creators. Download, customise, publish — no code needed.',
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
