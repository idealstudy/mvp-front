'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardTeacher from './teacher';

export const DashboardTeacherContainer = () => {
  return (
    <DashboardRoleShell role="ROLE_TEACHER">
      <DashboardTeacher />
    </DashboardRoleShell>
  );
};
