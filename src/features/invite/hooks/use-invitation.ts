import { useEffect, useState } from 'react';

import { InvitationInfoDTO, studyRoomRepository } from '@/entities/study-room';
import { AxiosError } from 'axios';

export const useInvitation = (token: string | null) => {
  const [data, setData] = useState<InvitationInfoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError<{ message?: string }> | null>(
    null
  );

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    studyRoomRepository
      .getInvitationInfo(token)
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [token]);

  return { data, isLoading, error };
};
