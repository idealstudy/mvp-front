import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import { getPublicTeachers } from '@/features/list';
import { ListGrid } from '@/features/list/components/list-grid';
import { ListPagination } from '@/features/list/components/list-pagination';
import { TeacherCard } from '@/features/list/components/teacher-card';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | 선생님 프로필 목록`,
  description: '디에듀 선생님 프로필을 최신순/가나다순으로 확인하세요.',
  alternates: { canonical: `${SITE_CONFIG.url}/list/teachers` },
  openGraph: {
    title: `${SITE_CONFIG.name} | 선생님 프로필 목록`,
    description: '디에듀 선생님 프로필을 최신순/가나다순으로 확인하세요.',
    url: `${SITE_CONFIG.url}/list/teachers`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: '디에듀 선생님 목록',
      },
    ],
  },
  robots: { index: true, follow: true },
};

type SortOption = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';

const parseSort = (value?: string): SortOption => {
  if (value === 'OLDEST' || value === 'ALPHABETICAL') return value;
  return 'LATEST';
};

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export default async function TeachersListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = parseSort(typeof sp.sort === 'string' ? sp.sort : undefined);
  const currentPage = parsePage(
    typeof sp.page === 'string' ? sp.page : undefined
  );
  /* TODO : 추후 업데이트 이후 적용 예정 */

  // const subject = typeof sp.subject === 'string' ? sp.subject : 'ALL';

  const data = await getPublicTeachers({
    page: currentPage - 1,
    size: 20,
    sort: sort,
    // subject: subject as 'ALL' | 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER',
  });

  if (!data?.content || data.content.length === 0) {
    return (
      <div className="font-body2-normal text-text-sub2 py-12 text-center">
        공개된 선생님 프로필이 아직 없습니다.
      </div>
    );
  }

  return (
    <>
      <ListGrid>
        {data.content.map((teacher, i) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            cardIndex={i + 1}
            sort={sort}
          />
        ))}
      </ListGrid>
      <ListPagination
        currentPage={currentPage}
        totalPages={data.totalPages}
      />
    </>
  );
}
