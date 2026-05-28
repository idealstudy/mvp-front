import { ReactNode } from 'react';

import {
  AnalyticsProvider,
  InterceptorProvider,
  QueryProvider,
  SessionProvider,
  ToastProvider,
} from '@/providers';
import { checkCookie } from '@/shared/lib';

import { PenSelectGuard } from './pen-select-guard';

interface Props {
  children: ReactNode;
}

export const GlobalProvider = async ({ children }: Props) => {
  const hasSession = await checkCookie();
  return (
    <InterceptorProvider>
      <QueryProvider>
        <SessionProvider initialHasSession={hasSession}>
          <PenSelectGuard />
          <AnalyticsProvider />
          <ToastProvider />
          {children}
        </SessionProvider>
      </QueryProvider>
    </InterceptorProvider>
  );
};
