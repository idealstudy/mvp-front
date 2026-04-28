'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useUpdateEnrollmentStatus } from '@/features/study-room-preview/hooks/use-update-enrollment-status';
import { useUpdateThumbnail } from '@/features/study-room-preview/hooks/use-update-thumbnail';
import { StudyStats } from '@/features/study-rooms/components/sidebar/status';
import { MiniSpinner } from '@/shared/components/loading';
import { SidebarButton } from '@/shared/components/sidebar';
import { Button } from '@/shared/components/ui';
import { StudyroomStatusToggle } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { useMemberStore } from '@/store';

import {
  usePreviewMainInfo,
  usePreviewSideInfo,
} from '../../hooks/use-preview';
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
  const router = useRouter();

  const [showPendingSkeleton, setShowPendingSkeleton] = useState(false);
  const [loading, setLoading] = useState(false);

  const member = useMemberStore((s) => s.member);

  const { data, isPending, isError } = usePreviewSideInfo(
    teacherId,
    studyRoomId
  );
  const { data: mainData } = usePreviewMainInfo(studyRoomId);

  const { mutate: updateThumbnail, isPending: isUploadingThumbnail } =
    useUpdateThumbnail(teacherId, studyRoomId);
  const { mutate: updateEnrollmentStatus } = useUpdateEnrollmentStatus(
    teacherId,
    studyRoomId
  );

  const isMyStudyRoom =
    member?.role === 'ROLE_TEACHER' && member.id === teacherId;

  // 파일 input ref (썸네일)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateThumbnail(file);
    e.target.value = '';
  };

  // 썸네일 삭제
  const handleThumbnailDelete = () => updateThumbnail(null);

  const onInquiryClick = () => {
    if (loading) return;

    setLoading(true);
    router.push(PUBLIC.INQUIRY.CREATE(teacherId, studyRoomId));
  };

  const moveToStudyRoom = () => {
    if (loading) return;

    setLoading(true);
    router.push(`/study-rooms/${studyRoomId}/note`);
  };

  const moveToProfile = () => {
    if (loading) return;

    setLoading(true);
    router.push(PUBLIC.PROFILE.TEACHER(teacherId));
  };

  const handleBtnClick = () => {
    if (isMyStudyRoom) {
      moveToStudyRoom();
    } else {
      onInquiryClick();
    }
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
        thumbnailUrl={data.thumbnailUrl}
        onThumbnailClick={isMyStudyRoom ? handleThumbnailClick : undefined}
        onThumbnailDelete={isMyStudyRoom ? handleThumbnailDelete : undefined}
        isUploading={isUploadingThumbnail}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <StudyStats
        numberOfTeachingNote={data.numberOfTeachingNotes}
        numberOfStudents={data.numberOfStudents}
        numberOfQuestion={data.numberOfQuestions}
      />

      {/* 운영 상태 토글 - 본인 스터디룸만 노출 */}
      {isMyStudyRoom && (
        <StudyroomStatusToggle
          value={mainData?.enrollmentStatus ?? null}
          onChange={(status) => {
            updateEnrollmentStatus(status);
          }}
        />
      )}

      <div className="flex flex-col gap-2">
        {(isMyStudyRoom || member?.role !== 'ROLE_TEACHER') && (
          <SidebarButton
            onClick={handleBtnClick}
            btnName={isMyStudyRoom ? `스터디룸으로 이동하기` : `수업 상담하기`}
            disabled={loading}
          />
        )}
        <Button
          onClick={moveToProfile}
          variant="secondary"
          disabled={loading}
        >
          {isMyStudyRoom ? `프로필로 이동하기` : `선생님 프로필 바로가기`}
        </Button>
      </div>

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
