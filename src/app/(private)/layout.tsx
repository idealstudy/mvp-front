import { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { SessionGuard } from '@/providers';
import { fetchMemberRole } from '@/shared/lib/server';

export default async function DashboardLayout({
  children,
  searchParams,
}: Readonly<{
  children: ReactNode;
  searchParams?: Promise<{ token?: string }>;
}>) {
  const session = await fetchMemberRole();
  const { token } = (await searchParams) ?? {};

  if (session.status === 'authenticated' && session.role === 'ROLE_MEMBER')
    redirect(token ? `/select-role?token=${token}` : '/select-role');

  return (
    <SessionGuard>
      <main className="desktop:pl-sidebar-width flex flex-col bg-[#F9F9F9]">
        <DashboardSidebar />
        <div className="w-full">{children}</div>
      </main>
    </SessionGuard>
  );
}
