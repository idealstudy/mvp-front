import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import {
  CLASS_FORM_TO_KOREAN,
  ENROLLMENT_STATUS_TO_KOREAN,
  SUBJECT_TO_KOREAN,
} from '@/entities/study-room-preview/core/preview.domain';
import { getPublicStudyRooms } from '@/features/list';
import { ListGrid } from '@/features/list/components/list-grid';
import { ListPagination } from '@/features/list/components/list-pagination';
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
type EnrollmentStatus = keyof typeof ENROLLMENT_STATUS_TO_KOREAN;
type ClassForm = keyof typeof CLASS_FORM_TO_KOREAN;
type SubjectType = keyof typeof SUBJECT_TO_KOREAN;

const parseSort = (value?: string): SortOption => {
  if (value === 'OLDEST' || value === 'ALPHABETICAL') return value;
  return 'LATEST';
};

const parseEnrollmentStatus = (
  value?: string
): EnrollmentStatus | undefined => {
  if (value && value in ENROLLMENT_STATUS_TO_KOREAN)
    return value as EnrollmentStatus;
};

const parseClassForm = (value?: string): ClassForm | undefined => {
  if (value && value in CLASS_FORM_TO_KOREAN) return value as ClassForm;
};

const parseSubjectType = (value?: string): SubjectType | undefined => {
  if (value && value in SUBJECT_TO_KOREAN) return value as SubjectType;
  return undefined;
};

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export default async function StudyRoomListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = parseSort(typeof sp.sort === 'string' ? sp.sort : undefined);
  const currentPage = parsePage(
    typeof sp.page === 'string' ? sp.page : undefined
  );
  const enrollmentStatus = parseEnrollmentStatus(
    typeof sp.enrollmentStatus === 'string' ? sp.enrollmentStatus : undefined
  );
  const classForm = parseClassForm(
    typeof sp.classForm === 'string' ? sp.classForm : undefined
  );
  const subjectType = parseSubjectType(
    typeof sp.subjectType === 'string' ? sp.subjectType : undefined
  );

  const data = await getPublicStudyRooms({
    page: currentPage - 1,
    size: 20,
    sort: sort,
    enrollmentStatus,
    classForm,
    subjectType,
  });

  if (!data?.content || data.content.length === 0) {
    return (
      <div className="font-body2-normal text-text-sub2 py-12 text-center">
        공개된 스터디룸이 아직 없습니다.
      </div>
    );
  }

  return (
    <>
      <ListGrid>
        {data.content.map((studyRoom) => (
          <StudyRoomCard
            key={studyRoom.id}
            studyRoom={studyRoom}
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
