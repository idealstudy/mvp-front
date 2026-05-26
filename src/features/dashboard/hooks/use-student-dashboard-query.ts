import {
  studentKeys,
  repository as studentRepository,
} from '@/entities/student';
import type {
  DashboardHomeworkSortKey,
  DashboardQnASortKey,
  DashboardTeachingNotesSortKey,
} from '@/entities/teacher/types';
import { useQuery } from '@tanstack/react-query';

const studentDashboardQuerySettings = {
  staleTime: 1000 * 60 * 5,
  retry: 3,
};

export const useStudentDashboardReportQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: studentKeys.dashboard.report(),
    queryFn: () => studentRepository.dashboard.getReport(),
    ...studentDashboardQuerySettings,
    enabled: options?.enabled ?? true,
  });
};

export const useStudentDashboardStudyRoomListQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: studentKeys.dashboard.studyRoomList(),
    queryFn: () => studentRepository.dashboard.getStudyRoomList(),
    ...studentDashboardQuerySettings,
    enabled: options?.enabled ?? true,
  });
};

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
    ...studentDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};

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
    ...studentDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};

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
    ...studentDashboardQuerySettings,
    enabled: enabled ?? true,
  });
};
