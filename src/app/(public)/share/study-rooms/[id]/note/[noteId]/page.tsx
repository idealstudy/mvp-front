import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { ShareRedirect } from '@/app/(public)/share/_components/share-redirect';
import { SITE_CONFIG } from '@/config/site';

type Props = {
  params: Promise<{ id: string; noteId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, noteId } = await params;
  const origin = await getRequestOrigin();
  const shareUrl = `${origin}/share/study-rooms/${id}/note/${noteId}`;
  const targetUrl = `${origin}/study-rooms/${id}/note/${noteId}`;
  const imageUrl = `${shareUrl}/opengraph-image`;
  const title = `수업노트 | ${SITE_CONFIG.name}`;

  return {
    title,
    alternates: { canonical: targetUrl },
    openGraph: {
      locale: 'ko_KR',
      type: 'article',
      title,
      url: shareUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: '수업노트',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [imageUrl],
    },
  };
}

export default async function ShareStudyNotePage({ params }: Props) {
  const { id, noteId } = await params;

  return <ShareRedirect href={`/study-rooms/${id}/note/${noteId}`} />;
}

const getRequestOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'https';

  return host ? `${protocol}://${host}` : SITE_CONFIG.url;
};
