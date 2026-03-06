import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { studyRoomRepository } from '@/entities/study-room';
import { PUBLIC } from '@/shared/constants';
import { isAxiosError } from 'axios';

export const useAcceptInvitation = () => {
  const router = useRouter();
  const acceptInvitation = useCallback(
    async (token: string) => {
      try {
        const data = await studyRoomRepository.student.acceptInvitation(token);
        router.push(PUBLIC.CORE.INVITE.SUCCESS(data.studyRoomResponse.id));
      } catch (error) {
        const code = isAxiosError(error)
          ? error.response?.data?.code
          : undefined;
        switch (code) {
          case 'INVITATION_EXPIRED':
            router.push(PUBLIC.CORE.INVITE.ERROR('EXPIRED_LINK'));
            break;
          case 'DUPLICATED_INVITEE':
            router.push(PUBLIC.CORE.INVITE.ERROR('ALREADY_PARTICIPATED'));
            break;
          case 'STUDY_ROOM_CAPACITY_EXCEEDED':
            router.push(
              PUBLIC.CORE.INVITE.ERROR('STUDY_ROOM_CAPACITY_EXCEEDED')
            );
            break;
          default:
            router.push(PUBLIC.CORE.INVITE.ERROR('INVALID_LINK'));
            break;
        }
      }
    },
    [router]
  );

  return { acceptInvitation };
};
