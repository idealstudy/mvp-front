import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteStudyNoteGroup, updateStudyNoteGroup } from './api';
import {
  StudyNoteGroupQueryKey,
  StudyNotesQueryKey,
  getStudyNotesOption,
} from './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  return useQuery(getStudyNotesOption(args));
};

export const useDeleteStudyNoteGroup = (args: {
  studyNoteId: number;
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStudyNoteGroup(args),
    onSuccess: () => {
      // 스터디 노트 리스트와 그룹 리스트를 다시 조회
      queryClient.invalidateQueries({
        queryKey: StudyNotesQueryKey.studyNotes({
          studyRoomId: args.studyRoomId,
          pageable: args.pageable,
          keyword: args.keyword,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.studyNoteGroups({
          studyRoomId: args.studyRoomId,
          pageable: { page: 0, size: 10, sort: ['desc'] },
        }),
      });
    },
  });
};

export const useUpdateStudyNoteGroup = (args: {
  teachingNoteId: number;
  teachingNoteGroupId: number;
  studyRoomId: number;
  pageable: { page: number; size: number; sortKey: string };
  keyword: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateStudyNoteGroup(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: StudyNotesQueryKey.studyNotes({
          studyRoomId: args.studyRoomId,
          pageable: args.pageable,
          keyword: args.keyword,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.studyNoteGroups({
          studyRoomId: args.studyRoomId,
          pageable: { page: 0, size: 10, sort: ['desc'] },
        }),
      });
    },
  });
};
