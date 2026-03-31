import { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import ColumnList from '@/features/community/column/components/column-list';
import CommunityShell from '@/features/community/components/community-shell';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | 칼럼`,
  description: '디에듀 선생님이 작성한 칼럼을 확인하세요.',
  alternates: { canonical: `${SITE_CONFIG.url}/community/column` },
  openGraph: {
    title: `${SITE_CONFIG.name} | 칼럼`,
    description: '디에듀 선생님이 작성한 칼럼을 확인하세요.',
    url: `${SITE_CONFIG.url}/community/column`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: '디에듀 칼럼',
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function ColumnPage() {
  return (
    <CommunityShell>
      <ColumnList />
    </CommunityShell>
  );
}
