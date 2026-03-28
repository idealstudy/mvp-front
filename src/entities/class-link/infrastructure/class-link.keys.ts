export const ClassLinkQueryKey = {
  all: ['classLinks'] as const,
  list: (studyRoomId: number) => ['classLinks', 'list', studyRoomId] as const,
};
