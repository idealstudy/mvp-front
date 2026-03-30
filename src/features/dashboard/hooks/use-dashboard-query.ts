import {
  studentKeys,
  repository as studentRepository,
} from '@/entities/student';
import {
  DashboardHomeworkSortKey,
  DashboardMemberSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
  teacherKeys,
  repository as teacherRepository,
} from '@/entities/teacher';
import type { Dashboard } from '@/features/dashboard';
import { options } from '@/features/dashboard/api';
import type { BaseQueryOptions } from '@/shared/lib/query/types';
import { useQuery } from '@tanstack/react-query';

/**
 * @description 대시보드 메인 데이터를 비동기로 불러오는 React Query 훅입니다.
 *
 * @param {BaseQueryOptions} [base={}] - 기본 설정을 덮어쓰기 위한 옵션.
 * @returns {import('@tanstack/react-query').UseQueryResult<Dashboard>} 쿼리 결과.
 */
export const useDashboardQuery = (base: BaseQueryOptions = {}) => {
  const dashboardData = options.getDashboard(base);
  /* ─────────────────────────────────────────────────────
   * 타입 충돌 이슈가 프로젝트에 남아 있다면 as any를 사용해야 할 수 있습니다.
   * Ex. return useQuery<Dashboard>(queryOptions as any);
   * 타입이 정상적으로 해결되었다고 가정하고 표준 형태로 작성합니다.
   * ────────────────────────────────────────────────────*/
  return useQuery<Dashboard>(dashboardData);
};

const settings = {
  staleTime: 1000 * 60 * 5, // 5분
  retry: 3, // 실패 시 재시도 횟수
};

// 선생님 대시보드 리포트 조회 쿼리 훅
export const useTeacherDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.dashboard.report(),
    queryFn: () => teacherRepository.dashboard.getReport(),
    ...settings,
    enabled: options?.enabled ?? true,
  });
};

// 학생 대시보드 보고서 조회 쿼리 훅
export const useStudentDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: studentKeys.dashboard.report(),
    queryFn: () => studentRepository.dashboard.getReport(),
    ...settings,
    enabled: options?.enabled ?? true,
  });
};

// 선생님 대시보드 스터디룸 목록 조회 쿼리 훅
export const useTeacherDashboardStudyRoomListQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.dashboard.studyRoomList(),
    queryFn: () => teacherRepository.dashboard.getStudyRoomList(),
    ...settings,
    enabled: options?.enabled ?? true,
  });
};

// 학생 대시보드 스터디룸 목록 조회 쿼리 훅
export const useStudentDashboardStudyRoomListQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: studentKeys.dashboard.studyRoomList(),
    queryFn: () => studentRepository.dashboard.getStudyRoomList(),
    ...settings,
    enabled: options?.enabled ?? true,
  });
};

// 선생님 대시보드 수업 노트 목록 조회 쿼리 훅 (페이지네이션)
export const useTeacherDashboardNoteListQuery = ({
  studyRoomId,
  page,
  size,
  sortKey,
  enabled,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardTeachingNotesSortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...teacherKeys.dashboard.noteList(studyRoomId),
      page,
      size,
      sortKey,
    ],
    queryFn: () =>
      teacherRepository.dashboard.getNoteList({
        studyRoomId,
        page,
        size,
        sortKey,
      }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 선생님 대시보드 질문 목록 조회 쿼리 훅 (페이지네이션)
export const useTeacherDashboardQnaListQuery = ({
  page,
  size,
  sortKey,
  enabled,
}: {
  page: number;
  size: number;
  sortKey: DashboardQnASortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [...teacherKeys.dashboard.qnaList(), page, size, sortKey],
    queryFn: () =>
      teacherRepository.dashboard.getQnaList({ page, size, sortKey }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 선생님 대시보드 멤버 목록 조회 쿼리 훅 (페이지네이션)
export const useTeacherDashboardMemberListQuery = ({
  studyRoomId,
  page,
  size,
  sortKey,
  enabled,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardMemberSortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...teacherKeys.dashboard.memberList(studyRoomId),
      page,
      size,
      sortKey,
    ],
    queryFn: () =>
      teacherRepository.dashboard.getMemberList({
        studyRoomId,
        page,
        size,
        sortKey,
      }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 선생님 대시보드 과제 목록 조회 쿼리 훅 (페이지네이션)
export const useTeacherDashboardHomeworkListQuery = ({
  studyRoomId,
  page,
  size,
  sortKey,
  enabled,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardHomeworkSortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...teacherKeys.dashboard.homeworkList(studyRoomId),
      page,
      size,
      sortKey,
    ],
    queryFn: () =>
      teacherRepository.dashboard.getHomeworkList({
        studyRoomId,
        page,
        size,
        sortKey,
      }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 학생 대시보드 수업 노트 목록 조회 쿼리 훅 (페이지네이션)
export const useStudentDashboardNoteListQuery = ({
  studyRoomId,
  page,
  size,
  sortKey,
  enabled,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardTeachingNotesSortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...studentKeys.dashboard.noteList(studyRoomId),
      page,
      size,
      sortKey,
    ],
    queryFn: () =>
      studentRepository.dashboard.getNoteList({
        studyRoomId,
        page,
        size,
        sortKey,
      }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 학생 대시보드 질문 목록 조회 쿼리 훅 (페이지네이션)
export const useStudentDashboardQnaListQuery = ({
  page,
  size,
  sortKey,
  enabled,
}: {
  page: number;
  size: number;
  sortKey: DashboardQnASortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [...studentKeys.dashboard.qnaList(), page, size, sortKey],
    queryFn: () =>
      studentRepository.dashboard.getQnaList({ page, size, sortKey }),
    ...settings,
    enabled: enabled ?? true,
  });
};

// 학생 대시보드 과제 목록 조회 쿼리 훅 (페이지네이션)
export const useStudentDashboardHomeworkListQuery = ({
  studyRoomId,
  page,
  size,
  sortKey,
  enabled,
}: {
  studyRoomId?: number;
  page: number;
  size: number;
  sortKey: DashboardHomeworkSortKey;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ...studentKeys.dashboard.homeworkList(studyRoomId),
      page,
      size,
      sortKey,
    ],
    queryFn: () =>
      studentRepository.dashboard.getHomeworkList({
        studyRoomId,
        page,
        size,
        sortKey,
      }),
    ...settings,
    enabled: enabled ?? true,
  });
};
