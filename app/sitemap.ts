import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { FR_PAGES, frEncPath } from '../lib/data';
import { getPosts, postEncPath } from '../lib/blog';
import { X_PAGES, xEncPath } from '../lib/x';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...(getPosts().length ? [{ url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 }] : []),
    ...getPosts().map((p) => ({ url: `${SITE_URL}${postEncPath(p)}`, lastModified: new Date(p.date), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...(X_PAGES.length ? ['/topics/', '/areas/'].map((u) => ({ url: `${SITE_URL}${u}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })) : []),
    ...X_PAGES.map((p) => ({ url: `${SITE_URL}${xEncPath(p)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...FR_PAGES.map((p) => ({ url: `${SITE_URL}${frEncPath(p)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
