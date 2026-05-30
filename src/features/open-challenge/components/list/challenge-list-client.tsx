'use client';

import { useState } from 'react';

import { Pagination, Select } from '@/shared/components/ui';
import { Inbox } from 'lucide-react';

import { useOpenChallengeListQuery } from '../../hooks/use-open-challenge';
import { ChallengeCard } from './challenge-card';
import { ChallengeListSkeleton } from './challenge-list-skeleton';

type SortOption = 'latest' | 'popular';

const PAGE_SIZE = 3;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

export const ChallengeListClient = () => {
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: challenges, isLoading } = useOpenChallengeListQuery({
    subject: 'ALL',
    sort: selectedSort,
  });

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((challenges?.length ?? 0) / PAGE_SIZE);
  const visibleChallenges = (challenges ?? []).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-text-main text-2xl font-bold">오픈 챌린지</h1>
          <p className="text-gray-8 mt-1 text-sm">
            전국의 학생들과 실력을 겨뤄보세요!
          </p>
        </div>
      </div>

      {isLoading ? (
        <ChallengeListSkeleton />
      ) : (
        <>
          <div className="flex justify-end">
            <Select
              value={selectedSort}
              onValueChange={(value) => handleSortChange(value as SortOption)}
            >
              <Select.Trigger
                className="border-line-line2 font-label-normal h-[36px] w-auto min-w-[90px] rounded-[8px] px-3 pr-8 text-sm whitespace-nowrap focus:ring-0 focus:outline-none"
                placeholder="최신순"
              />
              <Select.Content>
                {SORT_OPTIONS.map((sortOption) => (
                  <Select.Option
                    key={sortOption.value}
                    value={sortOption.value}
                    className="font-body2-normal flex h-[32px] w-full items-center justify-center border-b-0 text-center"
                  >
                    {sortOption.label}
                  </Select.Option>
                ))}
              </Select.Content>
            </Select>
          </div>

          {visibleChallenges.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                />
              ))}
            </div>
          ) : (
            <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white py-16 text-center">
              <Inbox
                size={36}
                className="text-gray-6"
              />
              <p className="font-body1-heading text-text-main">
                아직 등록된 문제가 없어요.
              </p>
              <p className="text-gray-8 text-sm">
                새 문제가 등록되면 이곳에 보여요.
              </p>
            </div>
          )}

          {(challenges?.length ?? 0) > PAGE_SIZE && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="justify-center pt-2"
            />
          )}
        </>
      )}
    </div>
  );
};
