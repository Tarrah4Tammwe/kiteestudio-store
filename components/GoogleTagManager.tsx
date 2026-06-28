import Script from 'next/script';
import { getAdSettings } from '@/lib/adSettings';

/**
 * Google Tag Manager loader.
 *
 * The GTM Container ID is managed from Admin → Settings → Ads & Tracking
 * (falls back to NEXT_PUBLIC_GTM_ID if nothing is set there). Once a GTM
 * container ID is in place, add/manage individual ad pixels (Meta, Google
 * Ads, Pinterest, TikTok) entirely inside the GTM dashboard at
 * tagmanager.google.com — no further code changes needed.
 *
 * Renders nothing if no GTM ID is configured anywhere.
 */
export default async function GoogleTagManager() {
  const { gtmId } = await getAdSettings();
  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
