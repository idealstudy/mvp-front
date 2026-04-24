import type { HomeworkPageable } from '../types';

// 선생님
export const TeacherHomeworkQueryKey = {
  all: ['teacherHomeworks'] as const,

  listBase: (studyRoomId: number) =>
    [...TeacherHomeworkQueryKey.all, 'list', studyRoomId] as const,

  list: (studyRoomId: number, query: HomeworkPageable) =>
    [
      ...TeacherHomeworkQueryKey.all,
      'list',
      studyRoomId,
      query.page,
      query.size,
      query.sortKey ?? 'DEADLINE_IMMINENT',
      query.keyword ?? '',
    ] as const,

  detail: (studyRoomId: number, homeworkId: number) =>
    [
      ...TeacherHomeworkQueryKey.all,
      'detail',
      studyRoomId,
      homeworkId,
    ] as const,
};

// 학생
export const StudentHomeworkQueryKey = {
  all: ['studentHomeworks'] as const,

  listBase: (studyRoomId: number) =>
    [...StudentHomeworkQueryKey.all, 'list', studyRoomId] as const,

  list: (studyRoomId: number, query: HomeworkPageable) =>
    [
      ...StudentHomeworkQueryKey.all,
      'list',
      studyRoomId,
      query.page,
      query.size,
      query.sortKey ?? 'DEADLINE_IMMINENT',
      query.keyword ?? '',
    ] as const,

  detail: (studyRoomId: number, homeworkId: number) =>
    [
      ...StudentHomeworkQueryKey.all,
      'detail',
      studyRoomId,
      homeworkId,
    ] as const,
};

// 보호자
export const ParentHomeworkQueryKey = {
  all: ['parentHomeworks'] as const,

  detail: (studentId: number, studyRoomId: number, homeworkId: number) =>
    [
      ...ParentHomeworkQueryKey.all,
      'detail',
      studentId,
      studyRoomId,
      homeworkId,
    ] as const,
};
