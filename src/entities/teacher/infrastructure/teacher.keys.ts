export const teacherKeys = {
  all: ['teacher'] as const,
  report: () => [...teacherKeys.all, 'report'] as const,
  noteList: () => [...teacherKeys.all, 'noteList'] as const,
  studyRoomList: () => [...teacherKeys.all, 'studyRoomList'] as const,
  dashboard: {
    all: () => [...teacherKeys.all, 'dashboard'] as const,
    report: () => [...teacherKeys.dashboard.all(), 'report'] as const,
    noteList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'noteList', studyRoomId] as const,
    studyRoomList: () =>
      [...teacherKeys.dashboard.all(), 'studyRoomList'] as const,
    QnaList: () => [...teacherKeys.dashboard.all(), 'QnaList'] as const,
    memberList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'memberList', studyRoomId] as const,
    homeworkList: (studyRoomId?: number) =>
      [...teacherKeys.dashboard.all(), 'homeworkList', studyRoomId] as const,
  },
  basicInfo: () => [...teacherKeys.all, 'basicInfo'] as const,
};
