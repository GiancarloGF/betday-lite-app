import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url.toString(),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
