'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardStudent from './student';

export const DashboardStudentContainer = () => {
  return (
    <DashboardRoleShell role="ROLE_STUDENT">
      <DashboardStudent />
    </DashboardRoleShell>
  );
};
