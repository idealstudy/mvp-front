import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { studyRoomRepository } from '@/entities/study-room';
import { INVITE_ERROR_CODE } from '@/features/invite/constants';
import { PUBLIC } from '@/shared/constants';
import { AxiosError } from 'axios';

export const useAcceptInvitation = () => {
  const router = useRouter();
  const acceptInvitation = useCallback(
    async (token: string) => {
      try {
        const data = await studyRoomRepository.student.acceptInvitation(token);
        router.push(PUBLIC.CORE.INVITE.SUCCESS(data.studyRoomResponse.id));
      } catch (error) {
        const message =
          (error instanceof AxiosError
            ? error.response?.data?.message
            : undefined) ?? '';
        switch (message) {
          case INVITE_ERROR_CODE.INVITATION_EXPIRED:
            router.push(PUBLIC.CORE.INVITE.ERROR('EXPIRED_LINK'));
            break;
          case INVITE_ERROR_CODE.DUPLICATED_INVITEE:
            router.push(PUBLIC.CORE.INVITE.ERROR('ALREADY_PARTICIPATED'));
            break;
          case INVITE_ERROR_CODE.STUDY_ROOM_CAPACITY_EXCEEDED:
            router.push(
              PUBLIC.CORE.INVITE.ERROR('STUDY_ROOM_CAPACITY_EXCEEDED')
            );
            break;
          case INVITE_ERROR_CODE.STUDY_ROOM_NOT_EXIST:
          case INVITE_ERROR_CODE.MEMBER_NOT_EXIST:
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
