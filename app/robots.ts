import type { MetadataRoute } from 'next';

// Explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
// etc.) alongside standard search bots — the whole point of a downloadable digital
// product catalogue is to be found and correctly described wherever people search,
// including inside AI answers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/cart', '/success'],
      },
    ],
    sitemap: 'https://kiteestudio.com/sitemap.xml',
  };
}
