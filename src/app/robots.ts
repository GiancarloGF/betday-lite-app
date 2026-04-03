import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/login', '/profile', '/bets/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteConfig.url).toString(),
    host: siteConfig.url.toString(),
  };
}
