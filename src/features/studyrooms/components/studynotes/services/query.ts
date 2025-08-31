import { useQuery } from '@tanstack/react-query';

import { getStudyNotesOption } from './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  return useQuery(getStudyNotesOption(args));
};
