import { StudyNotesByGroupIdQueryKey } from '@/features/studynotes/services/query-options';
import { StudyNoteGroupQueryKey } from '@/features/studyrooms/services/query-options';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { STUDYROOM_SIDEBAR_GROUPS_PAGEABLE } from '../groups';
import {
  createStudyNoteGroup,
  deleteStudyNoteGroup,
  deleteStudyRoom,
  updateStudyNoteGroup,
} from './api';

export const useCreateStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudyNoteGroup,
    onSuccess: (_, args) => {
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

export const useDeleteStudyRoom = () => {
  return useMutation({
    mutationFn: (args: { studyRoomId: number }) => deleteStudyRoom(args),
  });
};
