import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import { SITE_CONFIG } from '@/config/site';
import { Header } from '@/layout/header';
import { GlobalProvider } from '@/providers';
import '@/shared/components/editor/styles/text-editor.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'THE EDU',
  description:
    'THE EDU는 과외와 일정 관리를 하나의 플랫폼에서 제공합니다. 실시간 피드백, 스케줄 조정 기능을 경험해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} font-pretendard`}
      suppressHydrationWarning
    >
      <body className="bg-[#F9F9F9] antialiased">
        {/* GTM Head 스니펫 */}
        {gtmId && (
          <>
            <Script
              id="gtm-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                `,
              }}
            />
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${gtmId}');
                `,
              }}
            />
          </>
        )}
        {/* GTM Body 스니펫 (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
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
