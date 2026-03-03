'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { StudyStats } from '@/features/study-rooms/components/sidebar/status';
import { MiniSpinner } from '@/shared/components/loading';
import { SidebarButton } from '@/shared/components/sidebar';
import { useMemberStore } from '@/store';

import { usePreviewSideInfo } from '../../hooks/use-preview';
import { PreviewSideSkeleton } from '../preview-skeleton';
import { StudyroomPreviewSidebarHeader } from './header';
import { TeacherOtherStudyrooms } from './teacher-other-studyrooms';

type StudyroomPreviewContentsProps = {
  teacherId: number;
  studyRoomId: number;
};

const PENDING_SKELETON_DELAY = 150;

export const StudyroomPreviewSidebar = ({
  teacherId,
  studyRoomId,
}: StudyroomPreviewContentsProps) => {
  const { data, isPending, isError } = usePreviewSideInfo(
    teacherId,
    studyRoomId
  );
  const router = useRouter();

  const [showPendingSkeleton, setShowPendingSkeleton] = useState(false);
  const member = useMemberStore((s) => s.member);

  const isMyStudyRoom =
    member?.role === 'ROLE_TEACHER' && member.id === teacherId;

  const onInquiryClick = () => {
    alert('준비중 입니다.');
  };

  const moveToStudyRoom = () => {
    router.push(`/study-rooms/${studyRoomId}/note`);
  };

  useEffect(() => {
    if (!isPending) {
      setShowPendingSkeleton(false);
      return;
    }

    const timer = setTimeout(
      () => setShowPendingSkeleton(true),
      PENDING_SKELETON_DELAY
    );
    return () => clearTimeout(timer);
  }, [isPending]);

  const otherRooms =
    data?.otherStudyRooms
      .filter((room) => room.id !== studyRoomId)
      .map((room) => ({ id: room.id, name: room.name })) ?? [];

  if (isPending && showPendingSkeleton) {
    return <PreviewSideSkeleton />;
  }

  if (isPending) {
    return (
      <div className="flex justify-center py-6">
        <MiniSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-gray-7 px-2 py-3 text-sm">
        데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-gray-7 px-2 py-3 text-sm">
        표시할 정보가 없습니다.
      </div>
    );
  }

  return (
    <>
      <StudyroomPreviewSidebarHeader
        studyRoomName={data.name}
        teacherName={data.teacherName}
      />
      <StudyStats
        numberOfTeachingNote={data.numberOfTeachingNotes}
        numberOfStudents={data.numberOfStudents}
        numberOfQuestion={data.numberOfQuestions}
      />
      <SidebarButton
        onClick={isMyStudyRoom ? moveToStudyRoom : onInquiryClick}
        btnName={isMyStudyRoom ? `스터디룸으로 이동하기` : `수업 문의하기`}
      />
      {data.otherStudyRooms.length ? (
        <TeacherOtherStudyrooms
          studyRoomName={data.name}
          teacherId={teacherId}
          rooms={otherRooms}
        />
      ) : null}
    </>
  );
};
