'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardParent from './parent';

export const DashboardParentContainer = () => {
  return (
    <DashboardRoleShell role="ROLE_PARENT">
      <DashboardParent />
    </DashboardRoleShell>
  );
};
