import { queryOptions } from '@tanstack/react-query';

// import { queryOptions } from '@tanstack/react-query';

import { getStudyNotes } from './api';

// import { getConnectMembers, getStudyNoteGroups, getStudyRooms } from './api';

export const StudyNotesQueryKey = {
  all: ['studyNotes'],
  studyNotes: (args: {
    studyRoomId: number;
    pageable: { page: number; size: number; sortKey: string };
    keyword: string;
  }) => [
    ...StudyNotesQueryKey.all,
    'studyNotes',
    args.studyRoomId,
    args.pageable,
    args.keyword,
  ],
};

export const getStudyNotesOption = (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  return queryOptions({
    queryKey: StudyNotesQueryKey.studyNotes(args),
    queryFn: () => getStudyNotes(args),
  });
};
