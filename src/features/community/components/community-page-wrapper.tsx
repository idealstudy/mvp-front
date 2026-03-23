'use client';

import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { useSession } from '@/providers';
import { cn } from '@/shared/lib';

export default function CommunityPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex min-h-screen w-full">
      {isAuthenticated && <DashboardSidebar />}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isAuthenticated ? 'desktop:ml-[250px]' : 'pl-0'
        )}
      >
        {children}
      </main>
    </div>
  );
}
