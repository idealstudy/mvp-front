import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../components/types';
// import { deleteStudyNoteGroup, updateStudyNoteGroup } from './api';
import './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  // return useQuery(getStudyNotesOption(args));
  return useQuery({
    queryKey: ['studyNotes', args],
    queryFn: () => Promise.resolve([]), // 임시 구현
  });
};

export const useUpdateStudyNoteGroup = (args: {
  teachingNoteId: number;
  teachingNoteGroupId: number;
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(), // updateStudyNoteGroup(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['studyNotes', args.studyRoomId],
      });
      queryClient.invalidateQueries({
        queryKey: ['studyNoteGroups', args.studyRoomId],
      });
    },
  });
};
