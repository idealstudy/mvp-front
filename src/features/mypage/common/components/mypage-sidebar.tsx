'use client';

import EditableProfileCard from '@/features/mypage/common/components/editable-profile-card';
import ProfileNav from '@/features/mypage/common/components/profile-nav';
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

      <div className="border-line-line1 mt-2 space-y-2 rounded-xl border bg-white p-8">
        <h4 className="font-body1-heading">목록</h4>
        <ProfileNav role={role} />
      </div>
    </ColumnLayout.Left>
  );
}
