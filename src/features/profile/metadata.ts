import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import type { FrontendTeacherBasicInfo } from '@/entities/teacher/types';

export function generateTeacherProfileMetadata(
  teacherId: string,
  basicInfo: FrontendTeacherBasicInfo
): Metadata {
  const title = `${basicInfo.name} 선생님 프로필 | ${SITE_CONFIG.name}`;
  const description =
    basicInfo.simpleIntroduction ??
    `${basicInfo.name} 선생님의 프로필을 확인해보세요.`;
  const url = `${SITE_CONFIG.url}/profile/teacher/${teacherId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      locale: 'ko_KR',
      type: 'profile',
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      // TODO 프로필 이미지로 변경
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_CONFIG.ogImage],
    },
    robots: { index: true, follow: true },
  };
}
