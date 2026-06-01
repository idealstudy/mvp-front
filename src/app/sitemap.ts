import type { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/config/site';
import { serverEnv } from '@/shared/constants/api';

export const dynamic = 'force-dynamic';

type SitemapIdsResponse = { data: number[] };
type SitemapColumnsResponse = { data: { id: number; modDate: string }[] };

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${serverEnv.backendApiUrl}${path}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { data: [] } as T;
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profiles, previews, columns] = await Promise.all([
    fetchJson<SitemapIdsResponse>('/public/sitemap/profiles'),
    fetchJson<SitemapIdsResponse>('/public/sitemap/previews'),
    fetchJson<SitemapColumnsResponse>('/public/sitemap/columns'),
  ]);

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/list/teachers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...profiles.data.map((id) => ({
      url: `${SITE_CONFIG.url}/profile/teacher/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...previews.data.map((id) => ({
      url: `${SITE_CONFIG.url}/study-room-preview/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...columns.data.map(({ id, modDate }) => ({
      url: `${SITE_CONFIG.url}/community/column/${id}`,
      lastModified: new Date(modDate),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
