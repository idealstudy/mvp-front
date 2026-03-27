export const consultationKeys = {
  all: ['consultations'] as const,
  list: (studyRoomId: number, studentId: number) =>
    ['consultations', 'list', studyRoomId, studentId] as const,
};
