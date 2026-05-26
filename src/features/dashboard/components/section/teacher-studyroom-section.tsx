'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { PRIVATE } from '@/shared/constants';
import { trackDashboardStudyroomClick } from '@/shared/lib/analytics';

import StudyroomSectionContent from '../section-content/studyroom-section-content';
import DashboardSection from './single-section';

interface TeacherStudyroomSectionProps {
  studyRooms: { id: number; name: string }[];
  isPending: boolean;
  className?: string;
}

const TeacherStudyroomSection = ({
  studyRooms,
  isPending,
  className,
}: TeacherStudyroomSectionProps) => {
  const router = useRouter();

  const handleStudyRoomClick = useCallback(
    (studyRoomId: number) => {
      trackDashboardStudyroomClick(studyRoomId, 'ROLE_TEACHER');
      router.push(PRIVATE.ROOM.DETAIL(studyRoomId));
    },
    [router]
  );

  return (
    <DashboardSection
      title="나의 스터디룸"
      description="과제가 쌓일수록 바뀌는 스터디룸으로 진행 상황을 확인해보세요"
      className={className}
    >
      {isPending ? (
        <div className="flex w-full flex-col items-center gap-8">
          <div className="tablet:h-[300px] tablet:w-[300px] bg-gray-3 h-[200px] w-[200px] animate-pulse rounded-2xl" />
          <div className="bg-gray-3 tablet:h-12 h-10 w-40 animate-pulse rounded-lg" />
        </div>
      ) : (
        <StudyroomSectionContent
          studyRooms={studyRooms}
          onStudyRoomClick={handleStudyRoomClick}
        />
      )}
    </DashboardSection>
  );
};

export default TeacherStudyroomSection;
