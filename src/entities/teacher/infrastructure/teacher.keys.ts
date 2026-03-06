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
  basicInfo: () => [...teacherKeys.all, 'basicInfo'] as const,
  review: (params: ReviewListQuery) =>
    [...teacherKeys.all, 'review', params] as const,
  careers: () => [...teacherKeys.all, 'careers'] as const,
};
