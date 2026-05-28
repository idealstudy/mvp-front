'use client';

import { DashboardRoleShell } from './dashboard-role-shell';
import DashboardParent from './parent';

export const DashboardParentContainer = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  return (
    <DashboardRoleShell role="ROLE_PARENT">
      <DashboardParent initialMemberName={initialMemberName} />
    </DashboardRoleShell>
  );
};
