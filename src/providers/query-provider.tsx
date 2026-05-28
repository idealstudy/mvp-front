'use client';

import type { ReactNode } from 'react';

import dynamic from 'next/dynamic';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development' &&
  dynamic(
    () =>
      import('@tanstack/react-query-devtools').then(
        (mod) => mod.ReactQueryDevtools
      ),
    { ssr: false }
  );

interface QueryProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
};
