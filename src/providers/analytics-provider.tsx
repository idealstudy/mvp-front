'use client';

import { useEffect } from 'react';

import { useSession } from '@/providers/session/session-context';
import {
  initAmplitude,
  resetAnalyticsUser,
  setAnalyticsUser,
} from '@/shared/lib/analytics';

export const AnalyticsProvider = () => {
  const { member, status } = useSession();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && member) {
      setAnalyticsUser(String(member.id), member.role);
    } else if (status === 'unauthenticated' || status === 'error') {
      resetAnalyticsUser();
    }

    // member 객체 참조는 리페치마다 바뀌므로 원시값으로 좁혀 불필요한 재실행 방지
  }, [status, member?.id, member?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
