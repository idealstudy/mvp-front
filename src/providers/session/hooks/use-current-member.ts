'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useCoreCurrentMember } from '@/entities/member';
import { useMemberStore } from '@/store';

// 로그인한 사용자 정보 조회
export const useCurrentMember = (initialHasSession: boolean) => {
  const router = useRouter();
  const { setMember } = useMemberStore();
  const query = useCoreCurrentMember(initialHasSession);

  useEffect(() => {
    // 로그인 상태 처리
    if (query.data) {
      setMember(query.data);
      if (window.location.pathname === '/login') {
        const token = new URLSearchParams(window.location.search).get('token');
        router.replace(
          token ? `/dashboard?token=${encodeURIComponent(token)}` : '/dashboard'
        );
      }
    }
    // 로그아웃 상태 처리(데이터 없음 || 에러 발생)
    else if (query.isError || query.isFetched) {
      setMember(null);
    }
  }, [query.data, query.isError, query.isFetched, setMember, router]);
  return query;
};
