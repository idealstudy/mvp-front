export const StudyNoteQueryKey = {
  all: ['studyNotes'] as const,
  list: (
    studyRoomId: number,
    page: number,
    size: number,
    sortKey: string,
    keyword?: string
  ) =>
    [
      ...StudyNoteQueryKey.all,
      'list',
      studyRoomId,
      page,
      size,
      sortKey,
      ...(keyword ? [keyword] : []),
    ] as const,
  byGroupId: (
    studyRoomId: number,
    groupId: number,
    page: number,
    size: number,
    sortKey: string,
    keyword?: string
  ) =>
    [
      ...StudyNoteQueryKey.all,
      'byGroup',
      studyRoomId,
      groupId,
      page,
      size,
      sortKey,
      ...(keyword ? [keyword] : []),
    ] as const,
  detail: (teachingNoteId: number) =>
    [...StudyNoteQueryKey.all, 'detail', teachingNoteId] as const,
  members: (
    role: 'teacher' | 'student',
    studyRoomId: number,
    page = 0,
    size = 20
  ) =>
    [
      ...StudyNoteQueryKey.all,
      'members',
      role,
      studyRoomId,
      page,
      size,
    ] as const,
  listPrefix: (studyRoomId: number) =>
    [...StudyNoteQueryKey.all, 'list', studyRoomId] as const,
  byGroupPrefix: (studyRoomId: number, groupId: number) =>
    [...StudyNoteQueryKey.all, 'byGroup', studyRoomId, groupId] as const,
  membersPrefix: (role: 'teacher' | 'student', studyRoomId: number) =>
    [...StudyNoteQueryKey.all, 'members', role, studyRoomId] as const,
} as const;
