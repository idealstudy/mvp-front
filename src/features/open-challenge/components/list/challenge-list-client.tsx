'use client';

import { useState } from 'react';

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

const INITIAL_VISIBLE_COUNT = 3;

export const ChallengeListClient = ({
  challenges,
  streak,
}: ChallengeListClientProps) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>('ALL');
  const [selectedSort, setSelectedSort] = useState<SortOption>('latest');
  const [showAll, setShowAll] = useState(false);

  const filteredChallenges = challenges.filter(
    (challenge) =>
      selectedSubject === 'ALL' || challenge.subject === selectedSubject
  );

  const visibleChallenges = showAll
    ? filteredChallenges
    : filteredChallenges.slice(0, INITIAL_VISIBLE_COUNT);

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
        onSubjectChange={setSelectedSubject}
        onSortChange={setSelectedSort}
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
          <span className="text-3xl">📭</span>
          <p className="font-body1-heading text-text-main">
            아직 등록된 문제가 없어요.
          </p>
          <p className="text-gray-8 text-sm">다른 과목을 선택해보세요.</p>
        </div>
      )}

      {filteredChallenges.length > INITIAL_VISIBLE_COUNT && (
        <button
          onClick={() => setShowAll((previousShowAll) => !previousShowAll)}
          className="border-line-line1 text-text-main hover:bg-gray-1 w-full rounded-xl border bg-white py-4 text-sm font-semibold"
        >
          {showAll ? '접기' : '더 많은 챌린지 보기'}
        </button>
      )}
    </div>
  );
};
