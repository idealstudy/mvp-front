'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/shared/lib';

type NavItem = { key: string; label: string };

const NAV_ITEMS: Partial<Record<string, NavItem[]>> = {
  ROLE_TEACHER: [
    { key: 'profile', label: '내 프로필 수정' },
    { key: 'columns', label: '내 칼럼 목록' },
  ],
  ROLE_STUDENT: [
    { key: 'profile', label: '내 프로필 수정' },
    { key: 'consultations', label: '내 문의 목록' },
  ],
  ROLE_PARENT: [{ key: 'consultations', label: '내 문의 목록' }],
};

export default function ProfileNav({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'profile';
  const items = NAV_ITEMS[role] ?? [];

  if (items.length === 0) return null;

  return (
    <nav>
      {items.map((item) => (
        <Link
          key={item.key}
          href={`?tab=${item.key}`}
          className={cn(
            'hover:bg-background-gray block rounded-md px-2 py-2',
            activeTab === item.key && 'text-key-color-primary font-bold'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
