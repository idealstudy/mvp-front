export const studentKeys = {
  all: ['student'] as const,
  report: () => [...studentKeys.all, 'report'] as const,
  dashboard: {
    all: () => [...studentKeys.all, 'dashboard'] as const,
    report: () => [...studentKeys.dashboard.all(), 'report'] as const,
    noteList: () => [...studentKeys.dashboard.all(), 'noteList'] as const,
    studyRoomList: () =>
      [...studentKeys.dashboard.all(), 'studyRoomList'] as const,
    QnaList: () => [...studentKeys.dashboard.all(), 'QnaList'] as const,
    homeworkList: () =>
      [...studentKeys.dashboard.all(), 'homeworkList'] as const,
  },
};
