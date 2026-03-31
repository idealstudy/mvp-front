import {
  HomeworkListQuery,
  QnaListQuery,
  TeachingNoteListQuery,
} from '@/entities/student/types';

export const studentKeys = {
  all: ['student'] as const,

  // 마이페이지
  mypage: {
    all: () => [...studentKeys.all, 'mypage'] as const,
    basicInfo: () => [...studentKeys.mypage.all(), 'basicInfo'] as const,
    report: () => [...studentKeys.mypage.all(), 'report'] as const,
    homework: (params?: HomeworkListQuery) =>
      [...studentKeys.mypage.all(), 'homework', params] as const,
    qna: (params?: QnaListQuery) =>
      [...studentKeys.mypage.all(), 'qna', params] as const,
    teachingNote: (params?: TeachingNoteListQuery) =>
      [...studentKeys.mypage.all(), 'teachingNote', params] as const,
    studyRoom: () => [...studentKeys.mypage.all(), 'studyRoom'] as const,
  },

  // 대시보드
  dashboard: {
    all: () => [...studentKeys.all, 'dashboard'] as const,
    report: () => [...studentKeys.dashboard.all(), 'report'] as const,
    noteList: (studyRoomId?: number) =>
      [...studentKeys.dashboard.all(), 'noteList', studyRoomId] as const,
    studyRoomList: () =>
      [...studentKeys.dashboard.all(), 'studyRoomList'] as const,
    qnaList: () => [...studentKeys.dashboard.all(), 'qnaList'] as const,
    homeworkList: (studyRoomId?: number) =>
      [...studentKeys.dashboard.all(), 'homeworkList', studyRoomId] as const,
  },
};
