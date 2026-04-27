export const StudentNoteQueryKey = {
  all: ['studentNote'] as const,

  /* ─── Timer ─────────────────────────────────────────*/
  timerProgress: () =>
    [...StudentNoteQueryKey.all, 'timer', 'progress'] as const,

  /* ─── Calendar ──────────────────────────────────────*/
  monthly: (studentId: number, year: number, month: number) =>
    [...StudentNoteQueryKey.all, 'monthly', studentId, year, month] as const,

  daily: (studentId: number, date: string) =>
    [...StudentNoteQueryKey.all, 'daily', studentId, date] as const,

  /* ─── CRUD ──────────────────────────────────────────*/
  list: (page: number, size: number) =>
    [...StudentNoteQueryKey.all, 'list', page, size] as const,

  detail: (studyNoteId: number) =>
    [...StudentNoteQueryKey.all, 'detail', studyNoteId] as const,
} as const;
