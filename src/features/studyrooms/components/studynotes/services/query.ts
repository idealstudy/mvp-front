import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../type';
import { deleteStudyNoteGroup, updateStudyNoteGroup } from './api';
import {
  StudyNoteGroupQueryKey,
  StudyNotesQueryKey,
  getStudyNoteDetailsOption,
  getStudyNotesOption,
} from './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  return useQuery(getStudyNotesOption(args));
};

export const useDeleteStudyNoteGroup = (args: {
  studyNoteId: number;
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStudyNoteGroup(args),
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
          pageable: {
            page: args.pageable.page,
            size: args.pageable.size,
            sort: [args.pageable.sortKey],
          },
        }),
      });
    },
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
          pageable: {
            page: args.pageable.page,
            size: args.pageable.size,
            sort: [args.pageable.sortKey],
          },
        }),
      });
    },
  });
};

export const useStudyNoteDetailsQuery = (args: { teachingNoteId: number }) => {
  return useQuery(getStudyNoteDetailsOption(args));
};

export const useUpdateStudyNote = (args: {
  teachingNoteId: number;
  studyRoomId: number;
  teachingNoteGroupId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}) => {
  return useMutation({
    mutationFn: () => updateStudyNoteGroup(args),
  });
};
