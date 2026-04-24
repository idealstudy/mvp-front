import { useMemo } from 'react';

import type { StudentStudyRoom } from '@/features/study-rooms';

import {
  useStudentDashboardHomeworkListQuery,
  useStudentDashboardNoteListQuery,
  useStudentDashboardQnaListQuery,
} from './use-dashboard-query';

interface UseStudentOnboardingStatusProps {
  rooms: StudentStudyRoom[] | undefined;
}

/**
 * 학생 온보딩 완료 여부를 체크하는 훅 (학생 전용)
 * 실제 데이터를 기반으로 각 단계의 완료 여부를 확인합니다.
 * 강사는 useTeacherOnboardingQuery를 사용하세요.
 * !) 본래 학생, 강사 공용으로 사용되던 훅이었으나, 강사 온보딩이 개선됨에 따라 학생 전용으로 변경되었습니다.
 */
export const useOnboardingStatus = ({
  rooms,
}: UseStudentOnboardingStatusProps) => {
  const hasRooms = rooms && rooms.length > 0;
  const firstRoomId = rooms?.[0]?.id;

  const { data: noteList } = useStudentDashboardNoteListQuery({
    studyRoomId: firstRoomId,
    page: 0,
    size: 1,
    sortKey: 'LATEST_EDITED',
    enabled: !!firstRoomId,
  });

  const { data: qnaList } = useStudentDashboardQnaListQuery({
    page: 0,
    size: 1,
    sortKey: 'LATEST',
    enabled: !!firstRoomId,
  });

  const { data: homeworkList } = useStudentDashboardHomeworkListQuery({
    studyRoomId: firstRoomId,
    page: 0,
    size: 1,
    sortKey: 'LATEST',
    enabled: !!firstRoomId,
  });

  // 학생: 스터디룸에 참여했다면 학생이 있는 것으로 간주
  const hasStudents = useMemo(() => {
    if (!hasRooms || !firstRoomId) return false;
    return true;
  }, [hasRooms, firstRoomId]);

  // 학생: 수업노트 목록에서 실제로 수업노트가 있는지 확인
  const hasNotes = useMemo(() => {
    if (!hasRooms || !firstRoomId) return false;
    return !!noteList?.content && noteList.content.length > 0;
  }, [hasRooms, firstRoomId, noteList]);

  // 학생: QnA 목록에서 자신이 작성한 질문 확인 (대시보드 QnA는 본인 질문만 반환)
  const hasQuestions = useMemo(() => {
    if (!hasRooms || !firstRoomId) return false;
    return !!qnaList?.content && qnaList.content.length > 0;
  }, [hasRooms, firstRoomId, qnaList]);

  // 학생: 과제 목록에서 과제가 있는지 확인
  const hasAssignments = useMemo(() => {
    if (!hasRooms || !firstRoomId) return false;
    return !!homeworkList?.content && homeworkList.content.length > 0;
  }, [hasRooms, firstRoomId, homeworkList]);

  // 학생: 피드백 확인은 온보딩 단계가 아님
  const hasFeedback = false;

  return {
    hasRooms,
    hasStudents,
    hasNotes,
    hasQuestions,
    hasAssignments,
    hasFeedback,
  };
};
