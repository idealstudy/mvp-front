'use client';

import { StudyStats } from '@/features/study-rooms/components/sidebar/status';
import { SidebarButton } from '@/shared/components/sidebar';

import { StudyroomPreviewSidebarHeader } from './header';
import { TeacherOtherStudyrooms } from './teacher-other-studyrooms';

const studyRoomDetail = {
  name: '수학 스터디룸',
  teacherName: '홍길동',
  numberOfTeachingNote: 12,
  studentNames: ['1', '2', '3', '4', '5'],
  numberOfQuestion: 10,
};

const onClick = () => {
  alert('성공');
};
export const StudyroomPreviewSidebar = () => {
  return (
    <>
      <StudyroomPreviewSidebarHeader
        studyRoomName={studyRoomDetail?.name}
        teacherName={studyRoomDetail?.teacherName}
      />
      <StudyStats
        numberOfTeachingNote={studyRoomDetail?.numberOfTeachingNote}
        numberOfStudents={studyRoomDetail?.studentNames?.length}
        numberOfQuestion={studyRoomDetail?.numberOfQuestion}
      />
      {/* TODO: 수업 문의하기 연결 */}
      <SidebarButton
        onClick={() => onClick()}
        btnName="수업 문의하기"
      />

      <TeacherOtherStudyrooms />
    </>
  );
};
