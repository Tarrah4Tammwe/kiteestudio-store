import Script from 'next/script';

/**
 * Google Tag Manager loader.
 *
 * Add NEXT_PUBLIC_GTM_ID to your environment (e.g. GTM-XXXXXXX) and this
 * renders automatically — no further code changes needed. Once it's live,
 * add/manage individual ad pixels (Meta, Google Ads, Pinterest, TikTok)
 * entirely inside the GTM dashboard at tagmanager.google.com.
 *
 * If NEXT_PUBLIC_GTM_ID is not set, this renders nothing.
 */
export default function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
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
