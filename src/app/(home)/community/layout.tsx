import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';
import CommunityPageWrapper from '@/features/community/components/community-page-wrapper';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommunityPageWrapper>{children}</CommunityPageWrapper>;
}
