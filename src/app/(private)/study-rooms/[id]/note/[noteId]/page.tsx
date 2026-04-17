import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { SITE_CONFIG } from '@/config/site';
import BackLink from '@/features/dashboard/studynote/components/back-link';
import { StudyNoteDetailContentsSection } from '@/features/dashboard/studynote/detail/components/contents-section';
import { StudyNoteDetailMetaSection } from '@/features/dashboard/studynote/detail/components/meta-section';
import { StudyNoteDetailCommentSection } from '@/features/study-note-comment/components';
import { ColumnLayout } from '@/layout/column-layout';
import { PageViewTracker } from '@/shared/components/analytics';

type Props = {
  params: Promise<{ id: string; noteId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, noteId } = await params;
  const origin = await getRequestOrigin();
  const url = `${origin}/study-rooms/${id}/note/${noteId}`;
  const imageUrl = `${url}/opengraph-image`;
  const title = `수업노트 | ${SITE_CONFIG.name}`;

  return {
    title,
    alternates: { canonical: url },
    openGraph: {
      locale: 'ko_KR',
      type: 'article',
      title,
      url,
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

export default async function StudyNoteDetailPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <>
      <PageViewTracker pageName="studynote_detail" />
      <div className="w-full flex-col">
        <BackLink />
        <ColumnLayout className="desktop:p-6 items-start gap-6">
          <StudyNoteDetailMetaSection id={resolvedParams.noteId} />
          <StudyNoteDetailContentsSection id={resolvedParams.noteId} />
        </ColumnLayout>
        <ColumnLayout>
          <StudyNoteDetailCommentSection
            studyRoomId={resolvedParams.id}
            studyNoteId={resolvedParams.noteId}
          />
        </ColumnLayout>
      </div>
    </>
  );
}

const getRequestOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'https';

  return host ? `${protocol}://${host}` : SITE_CONFIG.url;
};
