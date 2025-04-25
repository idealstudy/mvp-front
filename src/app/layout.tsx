import { Suspense } from 'react';

import type { Metadata } from 'next';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { GlobalProvider } from '@/providers/global-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'THE EDU',
  description:
    'THE EDU는 과외와 일정 관리를 하나의 플랫폼에서 제공합니다. 실시간 피드백, 스케줄 조정 기능을 경험해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <Suspense fallback={null}>
          <GlobalProvider>{children}</GlobalProvider>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
