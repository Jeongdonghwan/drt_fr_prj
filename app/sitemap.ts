import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { FR_PAGES, frEncPath } from '../lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...FR_PAGES.map((p) => ({ url: `${SITE_URL}${frEncPath(p)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
