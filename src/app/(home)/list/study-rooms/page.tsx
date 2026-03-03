import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import { getPublicStudyRooms } from '@/features/list';
import { ListGrid } from '@/features/list/components/list-grid';
import { StudyRoomCard } from '@/features/list/components/study-room-card';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | 스터디룸 목록`,
  description: '디에듀 공개 스터디룸을 탐색하고 주제별 학습 공간을 찾아보세요.',
  alternates: { canonical: `${SITE_CONFIG.url}/list/study-rooms` },
  openGraph: {
    title: `${SITE_CONFIG.name} | 스터디룸 목록`,
    description:
      '디에듀 공개 스터디룸을 탐색하고 주제별 학습 공간을 찾아보세요.',
    url: `${SITE_CONFIG.url}/list/study-rooms`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: '디에듀 스터디룸 목록',
      },
    ],
  },
  robots: { index: true, follow: true },
};

type SortOption = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
/* TODO : 추후 업데이트 이후 적용 예정 */
// type SortSubjectOption = 'ALL' | 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';

const parseSort = (value?: string): SortOption => {
  if (value === 'OLDEST' || value === 'ALPHABETICAL') return value;
  return 'LATEST';
};

export default async function StudyRoomListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = parseSort(typeof sp.sort === 'string' ? sp.sort : undefined);

  const data = await getPublicStudyRooms({
    page: 0,
    size: 20,
    sort: sort,
  });

  if (!data?.content || data.content.length === 0) {
    return (
      <div className="font-body2-normal text-text-sub2 py-12 text-center">
        공개된 스터디룸이 아직 없습니다.
      </div>
    );
  }

  return (
    <ListGrid>
      {data.content.map((studyRoom) => (
        <StudyRoomCard
          key={studyRoom.id}
          studyRoom={studyRoom}
        />
      ))}
    </ListGrid>
  );
}
