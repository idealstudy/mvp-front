'use client';

import Link from 'next/link';

import { Role } from '@/entities/member';
import { cn } from '@/shared/lib/utils';

type Props = {
  studyRoomId: number;
  mode: Role | undefined;
  path: string;
};

const TABS_CONFIG = [
  { value: 'note', label: '수업노트', href: 'note', role: 'all' },
  { value: 'member', label: '학생', href: 'member', role: 'ROLE_TEACHER' },
  { value: 'qna', label: '질문', href: 'qna', role: 'all' },
];

const baseCls =
  'relative flex h-[55px] min-w-[170px] items-center justify-center gap-2 rounded-t-[12px] border px-5 text-lg transition-colors';

export const StudyNoteTab = ({ studyRoomId, mode, path }: Props) => {
  return (
    <ul className="flex gap-2">
      {TABS_CONFIG.map((tab) => {
        if (tab.role === 'ROLE_TEACHER' && mode !== 'ROLE_TEACHER') {
          return null;
        }

        const isActive = path === tab.href;
        const href = `/study-rooms/${studyRoomId}/${tab.href}`;

        return (
          <li key={tab.value}>
            <Link
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                baseCls,
                isActive
                  ? 'text-key-color-primary z-20 border-zinc-200 border-b-transparent bg-white font-semibold'
                  : 'text-text-sub2 z-10 border-zinc-200 bg-transparent hover:bg-zinc-50'
              )}
            >
              {tab.label}
              {isActive && <span className="sr-only">{tab.label}</span>}
              {isActive && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-white"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
