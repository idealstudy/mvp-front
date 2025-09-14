import { StudyNoteQueryKey } from '@/features/studynotes/services/query-options';
import { StudyRoomsGroupQueryKey } from '@/features/studyrooms/services/query-options';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [StudyRoomsGroupQueryKey.all],
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [StudyRoomsGroupQueryKey.all],
      });

      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.byGroupId],
      });
    },
  });
};

export const useDeleteStudyNoteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { teachingNoteGroupId: number; studyRoomId: number }) =>
      deleteStudyNoteGroup(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [StudyRoomsGroupQueryKey.all],
      });

      queryClient.invalidateQueries({
        queryKey: [StudyNoteQueryKey.byGroupId],
      });
    },
  });
};

export const useDeleteStudyRoom = () => {
  return useMutation({
    mutationFn: (args: { studyRoomId: number }) => deleteStudyRoom(args),
  });
};
