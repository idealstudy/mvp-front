import { Skeleton } from '@/shared/components/loading';

import { StudyRoomBrowseItem } from '../section-content/parent-studyroom-browse-item';
import DashboardSection from './single-section';

export type StudyRoomBrowseItemType = {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  teacherName: string;
  subjectType: 'KOREAN' | 'ENGLISH' | 'MATH' | 'OTHER';
};

const mockStudyRoom: StudyRoomBrowseItemType[] = [
  {
    id: 1,
    name: '개념부터 실전까지 국어 독해반',
    description:
      '중학생이 독해력과 문학 감상을 함께 키울 수 있도록 차근차근 지도하는 스터디룸입니다.',
    teacherId: 101,
    teacherName: '김국어',
    subjectType: 'KOREAN',
  },
  {
    id: 2,
    name: '기초부터 잡는 영어 문법 클래스',
    description:
      '문법 개념을 쉽게 이해하고 학교 시험까지 연결할 수 있도록 반복 학습 중심으로 운영합니다.',
    teacherId: 102,
    teacherName: '이영어',
    subjectType: 'ENGLISH',
  },
  {
    id: 3,
    name: '기초부터 잡는 영어 문법 클래스',
    description:
      '문법 개념을 쉽게 이해하고 학교 시험까지 연결할 수 있도록 반복 학습 중심으로 운영합니다.',
    teacherId: 103,
    teacherName: '이영어',
    subjectType: 'ENGLISH',
  },
  {
    id: 4,
    name: '기초부터 잡는 영어 문법 클래스',
    description:
      '문법 개념을 쉽게 이해하고 학교 시험까지 연결할 수 있도록 반복 학습 중심으로 운영합니다.',
    teacherId: 104,
    teacherName: '이영어',
    subjectType: 'ENGLISH',
  },
  {
    id: 5,
    name: '기초부터 잡는 영어 문법 클래스',
    description:
      '문법 개념을 쉽게 이해하고 학교 시험까지 연결할 수 있도록 반복 학습 중심으로 운영합니다.',
    teacherId: 105,
    teacherName: '이영어',
    subjectType: 'ENGLISH',
  },
];

export const StudyRoomBrowseSection = () => {
  const isPending = false;
  const limitStudyRooms = mockStudyRoom.slice(0, 4);
  return (
    <section>
      <DashboardSection
        title="스터디룸 둘러보기"
        description="디에듀가 엄선한 학습 공간을 확인해보세요"
        count={mockStudyRoom.length}
        isMoreHref="/list/study-rooms"
        isMore
      >
        {isPending ? (
          <div className="flex w-full flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton.Block
                key={i}
                className="h-12"
              />
            ))}
          </div>
        ) : (
          <StudyRoomBrowseItem studyRoom={limitStudyRooms} />
        )}
      </DashboardSection>
    </section>
  );
};
