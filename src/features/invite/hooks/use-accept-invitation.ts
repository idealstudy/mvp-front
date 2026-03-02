import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { studyRoomRepository } from '@/entities/study-room';
import { INVITE_ERROR_CODE } from '@/features/invite/constants';
import { PUBLIC } from '@/shared/constants';

export const useAcceptInvitation = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const acceptInvitation = useCallback(
    async (token: string) => {
      setIsPending(true);
      studyRoomRepository.student
        .acceptInvitation(token)
        .then((data) => {
          router.push(PUBLIC.CORE.INVITE.SUCCESS(data.studyRoomResponse.id));
        })
        .catch((error) => {
          const message: string =
            error?.response?.data?.message ?? error.message ?? '';
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
        })
        .finally(() => setIsPending(false));
    },
    [router]
  );

  return { acceptInvitation, isPending };
};
