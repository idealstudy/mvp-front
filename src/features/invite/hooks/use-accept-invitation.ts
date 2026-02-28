import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { studyRoomRepository } from '@/entities/study-room';
import { PUBLIC } from '@/shared/constants';

export const useAcceptInvitation = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const acceptInvitation = async (token: string) => {
    setIsPending(true);
    studyRoomRepository.student
      .acceptInvitation(token)
      .then(() => {
        router.push(PUBLIC.CORE.INVITE.SUCCESS);
      })
      .catch((error) => {
        switch (error.code) {
          case 'INVITATION_EXPIRED':
            router.push(PUBLIC.CORE.INVITE.ERROR('EXPIRED_LINK'));
            break;
          case 'DUPLICATE_INVITEE':
            router.push(PUBLIC.CORE.INVITE.ERROR('ALREADY_PARTICIPATED'));
            break;
          case 'STUDY_ROOM_CAPACITY_EXCEEDED':
            router.push(
              PUBLIC.CORE.INVITE.ERROR('STUDY_ROOM_CAPACITY_EXCEEDED')
            );
            break;
          case 'STUDY_ROOM_NOT_EXIST':
            router.push(PUBLIC.CORE.INVITE.ERROR('INVALID_LINK'));
            break;
        }
      })
      .finally(() => setIsPending(false));
  };

  return { acceptInvitation, isPending };
};
