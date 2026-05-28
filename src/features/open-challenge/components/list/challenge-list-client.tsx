'use client';

import { useState } from 'react';

import { Pagination } from '@/shared/components/ui';
import { Inbox } from 'lucide-react';

import { useOpenChallengeListQuery } from '../../hooks/use-open-challenge';
import { ChallengeCard, type ChallengeCardData } from './challenge-card';
import { StreakBanner } from './streak-banner';
import {
  type SortOption,
  type SubjectFilter,
  SubjectFilterBar,
} from './subject-filter';

type ChallengeListClientProps = {
  challenges: ChallengeCardData[];
  streak: { streakDays: number; todayCompleted: boolean };
};

const PAGE_SIZE = 3;

export const ChallengeListClient = ({
  challenges,
  streak,
}: ChallengeListClientProps) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('ALL');
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiChallenges } = useOpenChallengeListQuery({
    subject: selectedSubject,
    sort: selectedSort,
  });

  const sourceChallenges = apiChallenges ?? challenges;
  const totalPages = Math.ceil(sourceChallenges.length / PAGE_SIZE);
  const visibleChallenges = sourceChallenges.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSubjectChange = (subject: SubjectFilter) => {
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

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

      <StreakBanner
        streakDays={streak.streakDays}
        todayCompleted={streak.todayCompleted}
      />

      <SubjectFilterBar
        subject={selectedSubject}
        sort={selectedSort}
        onSubjectChange={handleSubjectChange}
        onSortChange={handleSortChange}
      />

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
          <p className="text-gray-8 text-sm">다른 과목을 선택해보세요.</p>
        </div>
      )}

      {sourceChallenges.length > PAGE_SIZE && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="justify-center pt-2"
        />
      )}
    </div>
  );
};
