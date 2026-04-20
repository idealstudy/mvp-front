export const commentKeys = {
  all: ['comment'] as const,
  list: (teachingNoteId: number) =>
    [...commentKeys.all, 'list', teachingNoteId] as const,
  readList: (teachingNoteId: number, commentId: number) =>
    [...commentKeys.all, 'readList', teachingNoteId, commentId] as const,
  parentList: (studentId: number, teachingNoteId: number) =>
    [...commentKeys.all, 'parentList', studentId, teachingNoteId] as const,
};
