import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { PRIVATE } from '@/shared/constants';
import { trackDashboardStudyroomClick } from '@/shared/lib/analytics';

import {
  useStudentDashboardStudyRoomListQuery,
  useTeacherDashboardStudyRoomListQuery,
} from '../../hooks/use-dashboard-query';
import StudyroomSectionContent from '../section-content/studyroom-section-content';
import DashboardSection from './single-section';

type Props = {
  className?: string;
};

const StudyroomSection = ({ className }: Props) => {
  const router = useRouter();
  const { member } = useAuth();
  const isTeacher = member?.role === 'ROLE_TEACHER';

  const { data: studentStudyRooms = [], isPending: isStudentPending } =
    useStudentDashboardStudyRoomListQuery({
      enabled: member?.role === 'ROLE_STUDENT',
    });

  const { data: teacherStudyRooms = [], isPending: isTeacherPending } =
    useTeacherDashboardStudyRoomListQuery({
      enabled: isTeacher,
    });

  const rooms = isTeacher ? teacherStudyRooms : studentStudyRooms;
  const isPending = isTeacher ? isTeacherPending : isStudentPending;
  const handleStudyRoomClick = useCallback(
    (studyRoomId: number) => {
      trackDashboardStudyroomClick(studyRoomId, member?.role);
      router.push(PRIVATE.ROOM.DETAIL(studyRoomId));
    },
    [router, member?.role]
  );

  return (
    <DashboardSection
      title={isTeacher ? '나의 스터디룸' : '참여 중인 스터디룸'}
      description={
        isTeacher
          ? '과제가 쌓일수록 바뀌는 스터디룸으로 진행 상황을 확인해보세요'
          : '스터디룸에서 활동하며 공간을 채워가 보세요.'
      }
      className={className}
    >
      {isPending ? (
        <div className="flex w-full flex-col items-center gap-8">
          <div className="tablet:h-[300px] tablet:w-[300px] bg-gray-3 h-[200px] w-[200px] animate-pulse rounded-2xl" />
          <div className="bg-gray-3 h-8 w-40 animate-pulse rounded-lg" />
        </div>
      ) : (
        <StudyroomSectionContent
          studyRooms={rooms}
          onStudyRoomClick={handleStudyRoomClick}
        />
      )}
    </DashboardSection>
  );
};

export default StudyroomSection;
