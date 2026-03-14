'use client';

import EditableProfileCard from '@/features/mypage/common/components/editable-profile-card';
import { ColumnLayout } from '@/layout';
import { useMemberStore } from '@/store';

export default function MypageSidebar() {
  const role = useMemberStore((state) => state.member?.role);

  if (!role) return;

  return (
    <ColumnLayout.Left>
      <div className="border-line-line1 flex flex-col gap-9 rounded-xl border bg-white p-8">
        <EditableProfileCard role={role} />
      </div>
    </ColumnLayout.Left>
  );
}
