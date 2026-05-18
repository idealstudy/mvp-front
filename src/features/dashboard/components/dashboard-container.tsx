'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { useInviteTokenHandler } from '@/features/invite/hooks';
import { trackPageView } from '@/shared/lib/analytics';
import { useMemberStore } from '@/store';

const DashboardTeacher = dynamic(() => import('./teacher'));
const DashboardStudent = dynamic(() => import('./student'));
const DashboardParent = dynamic(() => import('./parent'));

export const DashboardContainer = () => {
  const { isProcessing: isInviteProcessing } = useInviteTokenHandler();

  const session = useMemberStore((s) => s.member);
  const role = session?.role;

  React.useEffect(() => {
    // 대시보드 페이지뷰 이벤트
    trackPageView('dashboard', {}, role ?? null);
  }, [role]);

  if (isInviteProcessing) {
    return (
      <div className="bg-system-background">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-center px-6 pt-12 pb-24">
          <div className="text-text-sub2 text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  switch (role) {
    case 'ROLE_TEACHER':
      return <DashboardTeacher />;
    case 'ROLE_STUDENT':
      return <DashboardStudent />;
    case 'ROLE_PARENT':
      return <DashboardParent />;
    default:
      return null;
  }
};
