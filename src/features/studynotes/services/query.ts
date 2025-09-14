import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../../studyrooms/components/studynotes/type';
import { deleteStudyNoteToGroup, updateStudyNoteGroup } from './api';
import { updateStudyNote } from './api';
import {
  StudyNoteQueryKey,
  getStudyNotesByGroupIdOption,
  getStudyNotesOption,
} from './query-options';

export const useStudyNotesQuery = (args: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
}) => {
  return useQuery(getStudyNotesOption(args));
};

export const useStudyNotesByGroupIdQuery = (args: {
  studyRoomId: number;
  teachingNoteGroupId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
  enabled?: boolean;
}) => {
  return useQuery({
    ...getStudyNotesByGroupIdOption(args),
    enabled: args.enabled !== false,
  });
};

export const useDeleteStudyNoteToGroup = (args: {
  studyNoteId: number;
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
  // keyword: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStudyNoteToGroup(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.all],
      });
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.byGroupId],
      });
    },
  });
};

export const useUpdateStudyNoteToGroup = (args: {
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
        queryKey: [StudyNoteQueryKey.all],
      });
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.byGroupId],
      });
    },
  });
};

export const useUpdateStudyNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      teachingNoteId: number;
      studyRoomId: number;
      teachingNoteGroupId: number | null;
      title: string;
      content: string;
      visibility: string;
      taughtAt: string;
      studentIds: number[];
    }) => updateStudyNote(args),
    onSuccess: () => {
      // 스터디 노트 리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.all],
      });

      // 스터디 노트 그룹 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.byGroupId],
      });

      // 스터디 노트 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.update],
      });
    },
  });
};
