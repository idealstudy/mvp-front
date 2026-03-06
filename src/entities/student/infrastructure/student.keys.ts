export const studentKeys = {
  all: ['student'] as const,
  report: () => [...studentKeys.all, 'report'] as const,
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
  basicInfo: () => [...studentKeys.all, 'basicInfo'] as const,
};
