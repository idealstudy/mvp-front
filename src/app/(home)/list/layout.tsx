import type { Metadata } from 'next';

import { SITE_CONFIG } from '@/config/site';

import ListLayoutClient from './list-layout-client';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
};

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListLayoutClient>{children}</ListLayoutClient>;
}
