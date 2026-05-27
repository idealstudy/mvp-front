import { DashboardSidebar } from '@/features/dashboard/components/dashboard-sidebar';
import { fetchMemberRole } from '@/shared/lib/server';

export default async function OpenChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await fetchMemberRole();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <div className={isAuthenticated ? 'desktop:pl-sidebar-width' : ''}>
      {isAuthenticated && <DashboardSidebar />}
      {children}
    </div>
  );
}
