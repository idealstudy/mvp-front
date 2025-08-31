import { useMutation, useQuery } from '@tanstack/react-query';

import { deleteStudyNoteGroup } from './api';
import { getStudyNotesOption } from './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  return useQuery(getStudyNotesOption(args));
};

export const useDeleteStudyNoteGroup = (args: { studyNoteId: number }) => {
  return useMutation({
    mutationFn: () => deleteStudyNoteGroup(args),
  });
};
