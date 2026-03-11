import { NoteListQuery, ReviewListQuery } from '@/entities/teacher/types';

export const teacherKeys = {
  all: ['teacher'] as const,
  report: () => [...teacherKeys.all, 'report'] as const,
  description: () => [...teacherKeys.all, 'description'] as const,
  noteListAll: () => [...teacherKeys.all, 'noteList'] as const,
  noteList: (params: NoteListQuery) =>
    [...teacherKeys.all, 'noteList', params] as const,
  representativeNoteList: () =>
    [...teacherKeys.all, 'noteList', 'representative'] as const,
  studyRoomList: () => [...teacherKeys.all, 'studyRoomList'] as const,
  dashboard: {
    all: () => [...teacherKeys.all, 'dashboard'] as const,
    report: () => [...teacherKeys.dashboard.all(), 'report'] as const,
    noteList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'noteList', studyRoomId] as const,
    studyRoomList: () =>
      [...teacherKeys.dashboard.all(), 'studyRoomList'] as const,
    qnaList: () => [...teacherKeys.dashboard.all(), 'qnaList'] as const,
    memberList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'memberList', studyRoomId] as const,
    homeworkList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'homeworkList', studyRoomId] as const,
  },
  basicInfo: () => [...teacherKeys.all, 'basicInfo'] as const,
  review: (params: ReviewListQuery) =>
    [...teacherKeys.all, 'review', params] as const,
  careers: () => [...teacherKeys.all, 'careers'] as const,

  // 공개 프로필
  profile: {
    all: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId] as const,
    careers: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'careers'] as const,
    description: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'description'] as const,
    report: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'report'] as const,
    // page/size/type 추가 필요
    reviews: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'reviews'] as const,
    teachingNotes: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'teachingNotes'] as const,
    studyRooms: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'studyRooms'] as const,
    basicInfo: (teacherId: number) =>
      [...teacherKeys.all, 'profile', teacherId, 'basicInfo'] as const,
  },
};
