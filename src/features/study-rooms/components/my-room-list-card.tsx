'use client';

import Link from 'next/link';

import type { StudyRoom } from '@/features/study-rooms';
import { Icon } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';

const visibilityClassName = (visibility: StudyRoom['visibility']) => {
  if (visibility === 'PUBLIC') {
    return 'bg-[#E7F5EC] text-[#0B8A42]';
  }
  return 'bg-gray-scale-gray-5 text-text-sub1';
};

const visibilityLabel = (visibility: StudyRoom['visibility']) =>
  visibility === 'PUBLIC' ? '공개' : '비공개';

export const MyStudyRoomListCard = ({ room }: { room: StudyRoom }) => {
  return (
    <Link
      href={PRIVATE.ROOM.DETAIL(room.id)}
      className="group border-line-line1 hover:border-key-color-primary flex h-full flex-col gap-6 rounded-[24px] border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(255,72,5,0.16)]"
    >
      <div className="flex items-start gap-4">
        <div className="bg-orange-scale-orange-1 text-key-color-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]">
          <Icon.Notebook className="h-6 w-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-text-main text-lg leading-[140%] font-semibold tracking-[-0.04em]">
              <span className="block max-w-full truncate">{room.name}</span>
            </h3>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                visibilityClassName(room.visibility)
              )}
            >
              {visibilityLabel(room.visibility)}
            </span>
          </div>
          <p className="text-text-sub2 text-sm leading-6 opacity-90">
            {room.description || '아직 소개 문구가 작성되지 않았어요.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-text-sub2 inline-flex items-center gap-2">
          <Icon.Person className="h-4 w-4" />
          {room.teacherName
            ? `${room.teacherName} 선생님`
            : '담당 선생님 정보 준비중'}
        </span>
        <span className="text-key-color-primary inline-flex items-center gap-1 font-semibold">
          입장하기
          <Icon.ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};
