import { teacherKeys } from '@/entities/teacher/infrastructure/teacher.keys';
import { repository as teacherRepository } from '@/entities/teacher/infrastructure/teacher.repository';
import type {
  DashboardHomeworkSortKey,
  DashboardMemberSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
} from '@/entities/teacher/types';
import { useQuery } from '@tanstack/react-query';

const teacherDashboardQuerySettings = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
};

export const useTeacherDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.dashboard.report(),
    queryFn: () => teacherRepository.dashboard.getReport(),
    ...teacherDashboardQuerySettings,
    enabled: options?.enabled ?? true,
  });
};

export const useTeacherDashboardStudyRoomListQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: teacherKeys.dashboard.studyRoomList(),
    queryFn: () => teacherRepository.dashboard.getStudyRoomList(),
    ...teacherDashboardQuerySettings,
    enabled: options?.enabled ?? true,
  });
};

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
    ...teacherDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};

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
    ...teacherDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};

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
    ...teacherDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};

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
    ...teacherDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};
