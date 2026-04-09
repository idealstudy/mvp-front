export const parentKeys = {
  all: ['parent'] as const,
  dashboard: {
    all: () => [...parentKeys.all, 'dashboard'] as const,
    report: () => [...parentKeys.dashboard.all(), 'report'] as const,
    connectedStudentList: () =>
      [...parentKeys.dashboard.all(), 'connectedStudentList'] as const,
    studyNewsList: (studentId: number) =>
      [...parentKeys.dashboard.all(), 'studyNewsList', studentId] as const,
    studyConsultationList: (studyRoomId: number) =>
      [
        ...parentKeys.dashboard.all(),
        'studyConsultationList',
        studyRoomId,
      ] as const,
    studyRoomPreviewList: () =>
      [...parentKeys.dashboard.all(), 'studyRoomPreviewList'] as const,
    inquiryList: () => [...parentKeys.dashboard.all(), 'inquiryList'] as const,
  },
};
