import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { SITE_CONFIG } from '@/config/site';
import HomeworkDetailRoleSwitch from '@/features/homework/components/detail/homework-detail-role-switch';

type Props = {
  params: Promise<{ id: string; homeworkId: string }>;
  searchParams: Promise<{ studentId?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, homeworkId } = await params;
  const origin = await getRequestOrigin();
  const url = `${origin}/study-rooms/${id}/homework/${homeworkId}`;
  const title = `과제 | ${SITE_CONFIG.name}`;

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
          url: `${url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: '과제',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [`${url}/opengraph-image`],
    },
  };
}

export default async function HomeworkDetailPage({
  params,
  searchParams,
}: Props) {
export default async function HomeworkDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const studyRoomId = Number(resolvedParams.id);
  const homeworkId = Number(resolvedParams.homeworkId);
  const studentId = resolvedSearchParams.studentId
    ? Number(resolvedSearchParams.studentId)
    : 0;

  return (
    <HomeworkDetailRoleSwitch
      studyRoomId={studyRoomId}
      homeworkId={homeworkId}
      studentId={studentId}
    />
  );
}

const getRequestOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'https';

  return host ? `${protocol}://${host}` : SITE_CONFIG.url;
};
