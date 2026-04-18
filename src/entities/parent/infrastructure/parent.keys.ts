export const parentKeys = {
  all: ['parent'] as const,
  dashboard: {
    all: () => [...parentKeys.all, 'dashboard'] as const,
    report: () => [...parentKeys.dashboard.all(), 'report'] as const,
    connectedStudentList: () =>
      [...parentKeys.dashboard.all(), 'connectedStudentList'] as const,
    studyNewsList: (
      studentId: number | null,
      params?: { page?: number; size?: number }
    ) =>
      [
        ...parentKeys.dashboard.all(),
        'studyNewsList',
        studentId,
        params?.page ?? null,
        params?.size ?? null,
      ] as const,
    studyConsultationList: (
      studentId: number | null,
      studyRoomId: number | null,
      params?: { page?: number; size?: number }
    ) =>
      [
        ...parentKeys.dashboard.all(),
        'studyConsultationList',
        studentId,
        studyRoomId,
        params,
      ] as const,
    studyRoomPreviewList: () =>
      [...parentKeys.dashboard.all(), 'studyRoomPreviewList'] as const,
    inquiryList: () => [...parentKeys.dashboard.all(), 'inquiryList'] as const,
  },
};
