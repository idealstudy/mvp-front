'use client';

import { ReactNode, useEffect } from 'react';

import type { Role } from '@/entities/member';
import { useInviteTokenHandler } from '@/features/invite/hooks';
import { trackPageView } from '@/shared/lib/analytics';

type DashboardRoleShellProps = {
  children: ReactNode;
  role: Role;
};

export const DashboardRoleShell = ({
  children,
  role,
}: DashboardRoleShellProps) => {
  const { isProcessing: isInviteProcessing } = useInviteTokenHandler();

  useEffect(() => {
    trackPageView('dashboard', {}, role);
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

  return children;
};
