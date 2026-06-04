'use client';

import { useEffect, useState } from 'react';

import { type ChallengeReviewSort } from '@/entities/open-challenge';
import { BackButton } from '@/shared/components/ui';

import {
  useCancelChallengeReviewRecommendMutation,
  useChallengeReviewsQuery,
  useNextChallengeQuery,
  useRecommendChallengeReviewMutation,
} from '../../hooks/use-open-challenge';
import { AiFeedbackForm } from './ai-feedback-form';
import { ChallengeResultSkeleton } from './challenge-result-skeleton';
import { NextChallengeCard } from './next-challenge-card';
import { ResultStats } from './result-stats';
import { type SolutionItem, SolutionList } from './solution-list';

type SubmittedResult = {
  isCorrect: boolean;
  correctAnswer: string;
  passRate: number | null;
  participantCount: number;
  attemptId?: string;
};

type ChallengeResultProps = {
  challengeId: string;
};

const RESULT_STORAGE_KEY_PREFIX = 'open-challenge-result';

export const ChallengeResult = ({ challengeId }: ChallengeResultProps) => {
  const [isResultLoaded, setIsResultLoaded] = useState(false);
  const [submittedResult, setSubmittedResult] =
    useState<SubmittedResult | null>(null);
  const [reviewSort, setReviewSort] =
    useState<ChallengeReviewSort>('recommend');

  const { data: solutions, isLoading: isSolutionsLoading } =
    useChallengeReviewsQuery(challengeId, reviewSort);
  const { data: nextChallenge, isLoading: isNextChallengeLoading } =
    useNextChallengeQuery(challengeId);
  const recommendMutation = useRecommendChallengeReviewMutation(challengeId);
  const cancelRecommendMutation =
    useCancelChallengeReviewRecommendMutation(challengeId);

  useEffect(() => {
    const rawResult = window.sessionStorage.getItem(
      `${RESULT_STORAGE_KEY_PREFIX}:${challengeId}`
    );
    if (rawResult) setSubmittedResult(JSON.parse(rawResult));
    setIsResultLoaded(true);
  }, [challengeId]);

  if (!isResultLoaded || isSolutionsLoading || isNextChallengeLoading) {
    return <ChallengeResultSkeleton />;
  }

  const handleRecommendToggle = (solution: SolutionItem) => {
    if (solution.isRecommendedByMe) {
      cancelRecommendMutation.mutate(solution.id);
      return;
    }

    recommendMutation.mutate(solution.id);
  };

  return (
    <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {submittedResult && (
            <ResultStats
              isCorrect={submittedResult.isCorrect}
              correctAnswer={submittedResult.correctAnswer}
              passRate={submittedResult.passRate}
              participantCount={submittedResult.participantCount}
            />
          )}
          <SolutionList
            solutions={solutions ?? ([] as SolutionItem[])}
            totalCount={solutions?.length ?? 0}
            sort={reviewSort}
            isRecommendPending={
              recommendMutation.isPending || cancelRecommendMutation.isPending
            }
            onSortChange={setReviewSort}
            onRecommendToggle={handleRecommendToggle}
          />
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-[340px] lg:shrink-0">
          <AiFeedbackForm attemptId={submittedResult?.attemptId} />
          {nextChallenge && <NextChallengeCard {...nextChallenge} />}
        </aside>
      </div>
    </main>
  );
};
