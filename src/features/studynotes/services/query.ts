import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { StudyNoteGroupPageable } from '../../studyrooms/components/studynotes/type';
import { deleteStudyNoteToGroup, updateStudyNoteGroup } from './api';
import { updateStudyNote } from './api';
import {
  StudyNoteGroupQueryKey,
  StudyNotesQueryKey,
  UpdateStudyNoteQueryKey,
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
        queryKey: StudyNotesQueryKey.studyNotes({
          studyRoomId: args.studyRoomId,
          pageable: args.pageable,
          // keyword: args.keyword,
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
        queryKey: StudyNotesQueryKey.studyNotes({
          studyRoomId: args.studyRoomId,
          pageable: args.pageable,
          // keyword: args.keyword,
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
    onSuccess: (_, args) => {
      // 스터디 노트 리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: StudyNotesQueryKey.all,
      });

      // 스터디 노트 그룹 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.all,
      });

      // 스터디 노트 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: UpdateStudyNoteQueryKey.updateStudyNote({
          teachingNoteId: args.teachingNoteId,
          studyRoomId: args.studyRoomId,
          teachingNoteGroupId: args.teachingNoteGroupId,
          title: args.title,
          content: args.content,
          visibility: args.visibility,
          taughtAt: args.taughtAt,
          studentIds: args.studentIds,
        }),
      });
    },
  });
};
