import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import { ColumnDetail } from '@/entities/column';
import { extractText } from '@/shared/lib/utils';

const DESCRIPTION_MAX_LENGTH = 150;

export function generateColumnDetailMetadata(
  column: ColumnDetail,
  ogImageUrl?: string
): Metadata {
  const url = `${SITE_CONFIG.url}/community/column/${column.id}`;

  const description = extractText(column.resolvedContent.content).slice(
    0,
    DESCRIPTION_MAX_LENGTH
  );

  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630 }]
    : column.thumbnailUrl
      ? [{ url: column.thumbnailUrl, width: 1200, height: 630 }]
      : [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630 }];

  return {
    title: `${column.title} | ${SITE_CONFIG.name}`,
    description,
    keywords: column.tags,
    alternates: { canonical: url },
    openGraph: {
      locale: 'ko_KR',
      type: 'article',
      title: column.title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: column.title,
      description,
      images: [ogImageUrl ?? column.thumbnailUrl ?? SITE_CONFIG.ogImage],
    },
    robots: { index: true, follow: true },
  };
}
