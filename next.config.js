/** @type {import('next').NextConfig} */

// The site had zero security headers configured (default Vercel headers
// only). This adds the standard defensive set. CSP is intentionally
// permissive on script-src/style-src ('unsafe-inline') rather than
// nonce-based — the app relies heavily on inline style objects and Next's
// own hydration script — but still restricts which *origins* can load
// script/frame/connect content, which is the part that actually stops a
// third-party-script XSS payload from doing anything useful.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "media-src 'self'",
  "connect-src 'self' https://api.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://graph.facebook.com",
  "frame-src https://js.stripe.com https://checkout.stripe.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig = {
  images: { domains: [] },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
