'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardTeacher from './teacher';

export const DashboardTeacherContainer = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  return (
    <DashboardRoleShell role="ROLE_TEACHER">
      <DashboardTeacher initialMemberName={initialMemberName} />
    </DashboardRoleShell>
  );
};
