export const previewKeys = {
  all: ['studyRoomPreview'] as const,

  side: (teacherId: number, selectedStudyRoomId: number) =>
    [...previewKeys.all, 'side', teacherId, selectedStudyRoomId] as const,

  main: (studyRoomId: number) =>
    [...previewKeys.all, 'main', studyRoomId] as const,

  consultationList: (
    studyRoomId: number,
    params: { page: number; size: number }
  ) => [...previewKeys.all, 'consultationList', studyRoomId, params] as const,
};
