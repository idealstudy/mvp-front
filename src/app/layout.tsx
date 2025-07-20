import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { Header } from '@/components/layout/header';
import '@/features/editor/styles/text-editor.css';
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
    <html
      lang="ko"
      className={`${pretendard.variable} font-pretendard`}
    >
      <body className="antialiased">
        <GlobalProvider>
          <Header />
          <div className="mt-header-height flex flex-col">{children}</div>
        </GlobalProvider>
      </body>
    </html>
  );
}

const pretendard = localFont({
  src: [
    {
      path: '../assets/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Pretendard-ExtraBold.subset.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});
