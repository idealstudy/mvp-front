import { DashboardParentContainer } from '@/features/dashboard/components/dashboard-parent-container';
import { fetchMemberRole } from '@/shared/lib';

export default async function ParentDashboardPage() {
  const session = await fetchMemberRole();

  const initialMemberName =
    session.status === 'authenticated' ? session.name : '';

  return <DashboardParentContainer initialMemberName={initialMemberName} />;
}
