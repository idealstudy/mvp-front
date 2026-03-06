import { studyRoomRepository } from '@/entities/study-room';
import { useQuery } from '@tanstack/react-query';

export const useInvitation = (token: string | null) => {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => studyRoomRepository.getInvitationInfo(token!),
    enabled: !!token,
  });
};
