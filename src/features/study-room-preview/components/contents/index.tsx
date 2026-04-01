'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { StudyroomPreviewConsultationTab } from '@/features/study-room-preview/components/contents/consultation-tab';
import { StudyroomPreviewIntroTab } from '@/features/study-room-preview/components/contents/intro-tab';
import { cn } from '@/shared/lib';

const TABS = [
  { value: 'intro', label: '소개 요약' },
  { value: 'consultation', label: '문의 내역' },
];

export const StudyroomPreviewContents = ({
  studyRoomId,
  teacherId,
}: {
  studyRoomId: number;
  teacherId: number;
}) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'intro';

  return (
    <div>
      <ul className="flex gap-2">
        {TABS.map(({ value, label }) => {
          const isActive = tab === value;
          return (
            <li key={value}>
              <Link
                href={`?tab=${value}`}
                className={cn(
                  'border-line-line1 desktop:min-w-[150px] relative flex h-[55px] items-center justify-center rounded-t-xl border border-b-0 px-5 text-lg',
                  isActive
                    ? 'text-key-color-primary border-b-white bg-white font-semibold'
                    : 'text-text-sub2 bg-transparent hover:bg-zinc-50'
                )}
              >
                {label}
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
      {tab === 'intro' && (
        <StudyroomPreviewIntroTab
          studyRoomId={studyRoomId}
          teacherId={teacherId}
        />
      )}
      {tab === 'consultation' && (
        <StudyroomPreviewConsultationTab
          teacherId={teacherId}
          studyRoomId={studyRoomId}
        />
      )}
    </div>
  );
};
