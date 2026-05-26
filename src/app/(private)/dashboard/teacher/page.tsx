import { DashboardTeacherContainer } from '@/features/dashboard/components/dashboard-teacher-container';
import { fetchMemberRole } from '@/shared/lib';

export default async function TeacherDashboardPage() {
  const session = await fetchMemberRole();

  const initialMemberName =
    session.status === 'authenticated' ? session.name : '';
  return <DashboardTeacherContainer initialMemberName={initialMemberName} />;
}
