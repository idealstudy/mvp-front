import { studyRoomRepository } from '@/entities/study-room';
import { InvitationTokenQueryKey } from '@/features/study-rooms/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleInvitation = (studyRoomId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) =>
      studyRoomRepository.teacher.toggleInvitation(studyRoomId, enabled),
    onSuccess: (data) => {
      qc.setQueryData(InvitationTokenQueryKey.detail(studyRoomId), data);
    },
  });
};
