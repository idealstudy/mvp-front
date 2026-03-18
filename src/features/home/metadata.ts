import { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';

export const homeMetadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.description}`,
  description:
    '수업 기록, 학생 숙제와 질문 관리가 하나로 연결되는 경험. 스터디룸, 과제 관리, 실시간 피드백까지 디에듀에서 시작하세요.',
  keywords: [
    '과외 관리',
    '학생 관리',
    '수업 기록',
    '과제 관리',
    '온라인 스터디룸',
    '디에듀',
  ],
  alternates: { canonical: SITE_CONFIG.url },

  // 공통 (카카오톡 / 페이스북 / 디스코드 / 슬랙)
  openGraph: {
    locale: 'ko_KR',
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.description}`,
    description: '수업 기록, 학생 숙제와 질문 관리가 하나로 연결되는 경험',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - 수업 관리 플랫폼`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.description}`,
    description: '수업 기록, 학생 숙제와 질문 관리가 하나로 연결되는 경험',
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};
