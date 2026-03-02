import { useEffect, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { INVITE_VISITED_KEY } from '../constants';
import { useAcceptInvitation } from './use-accept-invitation';

export const useInviteTokenHandler = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { acceptInvitation } = useAcceptInvitation();
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!token || hasCalledRef.current) return;
    hasCalledRef.current = true;
    sessionStorage.setItem(INVITE_VISITED_KEY, Date.now().toString());
    acceptInvitation(token);
  }, [token, acceptInvitation]);
};
