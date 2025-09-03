import { StudyNotesByGroupIdQueryKey } from '@/features/studyrooms/components/studynotes/services/query-options';
import { StudyNoteGroupQueryKey } from '@/features/studyrooms/services/query-options';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { STUDYROOM_SIDEBAR_GROUPS_PAGEABLE } from '../groups';
import {
  deleteStudyNoteGroup,
  postStudyNoteGroup,
  updateStudyNoteGroup,
} from './api';
import {
  CreateStudyNoteGroupQueryKey,
  DeleteStudyNoteGroupQueryKey,
  UpdateStudyNoteGroupQueryKey,
} from './query-options';

export const useCreateStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { studyRoomId: number; title: string }) =>
      postStudyNoteGroup(args),
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: CreateStudyNoteGroupQueryKey.createStudyNoteGroup(args),
      });

      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.studyNoteGroups({
          studyRoomId: args.studyRoomId,
          pageable: STUDYROOM_SIDEBAR_GROUPS_PAGEABLE,
        }),
      });
    },
  });
};

export const useUpdateStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      teachingNoteGroupId: number;
      title: string;
      studyRoomId: number;
    }) => updateStudyNoteGroup(args),
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: UpdateStudyNoteGroupQueryKey.updateStudyNoteGroup(args),
      });

      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.studyNoteGroups({
          studyRoomId: args.studyRoomId,
          pageable: STUDYROOM_SIDEBAR_GROUPS_PAGEABLE,
        }),
      });

      queryClient.invalidateQueries({
        queryKey: StudyNotesByGroupIdQueryKey.all,
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey[0] === 'studyNotesByGroupId' &&
            Number(queryKey[2]) === args.studyRoomId &&
            Number(queryKey[3]) === args.teachingNoteGroupId
          );
        },
      });
    },
  });
};

export const useDeleteStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { teachingNoteGroupId: number; studyRoomId: number }) =>
      deleteStudyNoteGroup(args),
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: DeleteStudyNoteGroupQueryKey.deleteStudyNoteGroup(args),
      });

      queryClient.invalidateQueries({
        queryKey: StudyNoteGroupQueryKey.studyNoteGroups({
          studyRoomId: args.studyRoomId,
          pageable: STUDYROOM_SIDEBAR_GROUPS_PAGEABLE,
        }),
      });

      queryClient.invalidateQueries({
        queryKey: StudyNotesByGroupIdQueryKey.all,
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey[0] === 'studyNotesByGroupId' &&
            Number(queryKey[2]) === args.studyRoomId &&
            Number(queryKey[3]) === args.teachingNoteGroupId
          );
        },
      });
    },
  });
};
