import { DashboardStudentContainer } from '@/features/dashboard/components/dashboard-student-container';
import { fetchMemberRole } from '@/shared/lib';

export default async function StudentDashboardPage() {
  const session = await fetchMemberRole();

  const initialMemberName =
    session.status === 'authenticated' ? session.name : '';

  return <DashboardStudentContainer initialMemberName={initialMemberName} />;
}
