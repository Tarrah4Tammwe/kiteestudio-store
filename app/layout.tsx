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

const DEFAULT_TITLE = 'KiTee Studio — Downloadable Apps, AuDHD Tools & Website Templates';
const DEFAULT_DESCRIPTION = 'Downloadable utility apps and premium website templates — AuDHD & neurodivergent tools, fitness trackers, business kits, life planners, and SiteFill™ website templates for coaches, authors, freelancers, and speakers. Buy once, own forever. No subscriptions.';

export const metadata: Metadata = {
  metadataBase: new URL('https://kiteestudio.com'),
  title: { template: '%s — KiTee Studio', default: DEFAULT_TITLE },
  description: DEFAULT_DESCRIPTION,
  keywords: ['AuDHD app', 'ADHD app', 'neurodivergent tools', 'offline app no subscription', 'downloadable website template', 'SiteFill website template', 'digital planner app', 'freelancer website template', 'business tools app'],
  alternates: { canonical: '/' },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: 'https://kiteestudio.com',
    siteName: 'KiTee Studio',
    type: 'website',
    images: [{ url: 'https://kiteestudio.com/images/products/burnout-01.jpg', width: 900, height: 900, alt: 'KiTee Studio — downloadable apps and website templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['https://kiteestudio.com/images/products/burnout-01.jpg'],
  },
  other: {
    'p:domain_verify': 'aa93db1fd27e9dcb353c7a77ebcfb8c8',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KiTee Studio',
  url: 'https://kiteestudio.com',
  logo: 'https://kiteestudio.com/images/products/burnout-01.jpg',
  sameAs: [
    'https://linkedin.com/in/tarrah-nhari',
    'https://kiteestudio.substack.com',
    'https://tiktok.com/@kiteestudio',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'KiTee Studio',
  url: 'https://kiteestudio.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://kiteestudio.com/shop?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
        />
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
