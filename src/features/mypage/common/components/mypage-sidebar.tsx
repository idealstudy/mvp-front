'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import EditableProfileCard from '@/features/mypage/common/components/editable-profile-card';
import ProfileNav from '@/features/mypage/common/components/profile-nav';
import { ColumnLayout } from '@/layout';
import { useMemberStore } from '@/store';

// 접근 가능 탭
const VALID_TABS: Partial<Record<string, string[]>> = {
  ROLE_TEACHER: ['profile', 'columns', 'received-inquiries'],
  ROLE_STUDENT: ['profile', 'inquiries'],
  ROLE_PARENT: ['profile', 'inquiries'],
};

// 기본 탭
const DEFAULT_TAB: Partial<Record<string, string>> = {
  ROLE_TEACHER: 'profile',
  ROLE_STUDENT: 'profile',
  ROLE_PARENT: 'profile',
};

export default function MypageSidebar() {
  const role = useMemberStore((state) => state.member?.role);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab');

  useEffect(() => {
    if (!role) return;
    const validTabs = VALID_TABS[role] ?? [];
    const defaultTab = DEFAULT_TAB[role] ?? 'profile';
    if (!tab || !validTabs.includes(tab)) {
      router.replace(`?tab=${defaultTab}`);
    }
  }, [role, tab, router]);

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
