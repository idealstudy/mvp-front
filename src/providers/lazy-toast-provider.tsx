'use client';

import dynamic from 'next/dynamic';

export const LazyToastProvider = dynamic(
  () =>
    import('./toast-provider').then((module) => ({
      default: module.ToastProvider,
    })),
  { ssr: false }
);
