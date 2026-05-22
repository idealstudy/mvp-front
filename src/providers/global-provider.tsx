import { ReactNode } from 'react';

import { checkCookie } from '@/shared/lib';

import { AnalyticsProvider } from './analytics-provider';
import { InterceptorProvider } from './interceptor-provider';
import { LazyToastProvider } from './lazy-toast-provider';
import { QueryProvider } from './query-provider';
import { SessionProvider } from './session';

interface Props {
  children: ReactNode;
}

export const GlobalProvider = async ({ children }: Props) => {
  const hasSession = await checkCookie();
  return (
    <InterceptorProvider>
      <QueryProvider>
        <SessionProvider initialHasSession={hasSession}>
          <AnalyticsProvider />
          <LazyToastProvider />
          {children}
        </SessionProvider>
      </QueryProvider>
    </InterceptorProvider>
  );
};
