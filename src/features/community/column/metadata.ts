import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import { ColumnDetail } from '@/entities/column';
import { extractText } from '@/shared/lib/utils';

const DESCRIPTION_MAX_LENGTH = 150;

export function generateColumnDetailMetadata(
  column: ColumnDetail,
  origin: string = SITE_CONFIG.url
): Metadata {
  const url = `${origin}/community/column/${column.id}`;
  const ogImageUrl = `${url}/opengraph-image`;

  const description = extractText(column.resolvedContent.content).slice(
    0,
    DESCRIPTION_MAX_LENGTH
  );

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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: '칼럼' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: column.title,
      description,
      images: [ogImageUrl],
    },
    robots: { index: true, follow: true },
  };
}
