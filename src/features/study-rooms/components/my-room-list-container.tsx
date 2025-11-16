'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { teacherStudyRoomQueryOptions } from '@/features/study-rooms';
import {
  MyRoomListEmpty,
  MyRoomListSkeleton,
  MyStudyRoomListCard,
  StudyRoomListError,
} from '@/features/study-rooms/components';
import { Button } from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui/icon';
import { SearchInput } from '@/shared/components/ui/search-input';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';

/* ─────────────────────────────────────────────────────
 * Test
 * ────────────────────────────────────────────────────*/
type VisibilityFilter = 'ALL' | 'PUBLIC' | 'PRIVATE';

const VISIBILITY_LABEL: Record<VisibilityFilter, string> = {
  ALL: '전체',
  PUBLIC: '공개',
  PRIVATE: '비공개',
};

const FILTER_OPTIONS: { value: VisibilityFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];
export const MyStudyRoomListContainer = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    teacherStudyRoomQueryOptions.teacherList()
  );

  const [keyword, setKeyword] = useState('');
  const [visibility, setVisibility] = useState<VisibilityFilter>('ALL');

  const normalizedKeyword = keyword.trim().toLowerCase();
  const rooms = data ?? [];

  const filteredRooms = useMemo(() => {
    const list = data ?? [];
    if (!list.length) return [];

    return list.filter((room) => {
      const matchesVisibility =
        visibility === 'ALL' || room.visibility === visibility;

      if (!matchesVisibility) return false;

      if (!normalizedKeyword) return true;

      const haystack = [room.name, room.description, room.teacherName]
        .filter(Boolean)
        .map((value) => value.toLowerCase());

      return haystack.some((value) => value.includes(normalizedKeyword));
    });
  }, [data, normalizedKeyword, visibility]);

  const totalRooms = rooms.length;
  const hasRooms = totalRooms > 0;
  const hasActiveFilter = visibility !== 'ALL' || normalizedKeyword.length > 0;

  const handleResetFilters = () => {
    setKeyword('');
    setVisibility('ALL');
  };

  let content: React.ReactNode;

  if (isLoading) {
    content = <MyRoomListSkeleton />;
  } else if (isError) {
    content = (
      <StudyRoomListError
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else if (!hasRooms) {
    content = <MyRoomListEmpty hasRooms={false} />;
  } else if (!filteredRooms.length) {
    content = (
      <MyRoomListEmpty
        hasRooms
        isFiltering={hasActiveFilter}
        keyword={keyword}
        onReset={handleResetFilters}
      />
    );
  } else {
    content = (
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredRooms.map((room) => (
          <MyStudyRoomListCard
            key={room.id}
            room={room}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-6 pt-12 pb-24">
      {/* Header - Title and Button */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-text-main text-[32px] leading-[140%] font-bold tracking-[-0.04em]">
            스터디룸 목록
          </h1>
          <p className="text-text-sub2 text-sm">
            학생과 함께하는 공간을 한눈에 살펴보세요
          </p>
          <div className="text-text-sub1 text-sm">
            총{' '}
            <span className="text-key-color-primary font-semibold">
              {totalRooms}
            </span>
            개의 스터디룸이 준비되어 있어요
          </div>
        </div>
        <Button
          variant="primary"
          size="small"
          className="border-none shadow-[0_16px_32px_rgba(255,72,5,0.24)]"
          asChild
        >
          <Link href={PRIVATE.ROOM.CREATE}>
            <Icon.Plus className="mr-1.5" /> 새 스터디룸 만들기
          </Link>
        </Button>
      </header>

      {/* Main Contents - List of Study Rooms */}
      <section className="rounded-[32px] bg-white p-8 shadow-[0_24px_48px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
              className="w-full md:max-w-[620px]"
              placeholder="스터디룸 이름이나 선생님을 검색해보세요"
              value={keyword}
              onChange={setKeyword}
              onSearch={(value) => setKeyword(value.trim())}
            />
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value)}
                  className={cn(
                    'border-line-line1 text-text-sub1 bg-gray-scale-white rounded-full border px-4 py-2 text-sm font-medium transition',
                    visibility === option.value
                      ? 'bg-key-color-primary border-transparent text-white shadow-[0_16px_32px_rgba(255,72,5,0.18)]'
                      : 'hover:border-line-line2 hover:bg-gray-scale-gray-1'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {hasRooms && !isLoading && !isError && (
            <p className="text-text-sub2 text-sm">
              {VISIBILITY_LABEL[visibility]} 스터디룸 {filteredRooms.length}개를
              찾았어요
            </p>
          )}

          <div>{content}</div>
        </div>
      </section>
    </div>
  );
};
