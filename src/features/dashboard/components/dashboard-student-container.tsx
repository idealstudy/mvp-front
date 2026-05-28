'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardStudent from './student';

export const DashboardStudentContainer = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  return (
    <DashboardRoleShell role="ROLE_STUDENT">
      <DashboardStudent initialMemberName={initialMemberName} />
    </DashboardRoleShell>
  );
};
