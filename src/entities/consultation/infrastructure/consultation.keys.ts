export const consultationKeys = {
  all: ['consultations'] as const,
  list: (studyRoomId: number, studentId: number) =>
    ['consultations', 'list', studyRoomId, studentId] as const,
  detail: (studyRoomId: number, studentId: number, sheetId: number) =>
    ['consultations', 'detail', studyRoomId, studentId, sheetId] as const,
};
