'use client';

import { useEffect, useState } from 'react';

import { BackButton } from '@/shared/components/ui';
import { Bot } from 'lucide-react';

import {
  useChallengeReviewsQuery,
  useNextChallengeQuery,
} from '../../hooks/use-open-challenge';
import { AiFeedbackForm } from './ai-feedback-form';
import { NextChallengeCard } from './next-challenge-card';
import { ResultStats } from './result-stats';
import { type SolutionItem, SolutionList } from './solution-list';

type ChallengeResultProps = {
  challengeId: string;
  result: {
    isCorrect: boolean;
    correctAnswer: string;
    passRate: number;
    participantCount: number;
  };
  solutions: SolutionItem[];
  nextChallenge: {
    id: string;
    subject: string;
    title: string;
    passRate: number;
    participantCount: number;
    questionImageUrl: string | null;
  };
};

const MOCK_TOTAL_SOLUTION_COUNT = 36;
const MOCK_AI_COMMENT =
  '잘했어요! 기본 개념을 정확히 이해하고 계산도 깔끔하게 마무리했어요. 👏 이런 문제는 자신감 포인트예요!';
const RESULT_STORAGE_KEY_PREFIX = 'open-challenge-result';

export const ChallengeResult = ({
  challengeId,
  result,
  solutions,
  nextChallenge,
}: ChallengeResultProps) => {
  const [submittedResult, setSubmittedResult] = useState<
    (typeof result & { attemptId?: string }) | null
  >(null);

  const { data: apiSolutions } = useChallengeReviewsQuery(challengeId);
  const { data: apiNextChallenge } = useNextChallengeQuery(challengeId);

  // API 응답이 없거나 백엔드가 준비되지 않은 경우 기존 프로토타입 mock props로 화면을 유지한다.
  const activeResult = submittedResult ?? result;
  const activeSolutions = apiSolutions ?? solutions;
  const activeNextChallenge = apiNextChallenge ?? nextChallenge;

  useEffect(() => {
    const rawResult = window.sessionStorage.getItem(
      `${RESULT_STORAGE_KEY_PREFIX}:${challengeId}`
    );
    if (!rawResult) return;
    setSubmittedResult(JSON.parse(rawResult));
  }, [challengeId]);

  return (
    <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ResultStats
            isCorrect={activeResult.isCorrect}
            correctAnswer={activeResult.correctAnswer}
            passRate={activeResult.passRate}
            participantCount={activeResult.participantCount}
          />
          <SolutionList
            solutions={activeSolutions}
            totalCount={activeSolutions.length || MOCK_TOTAL_SOLUTION_COUNT}
          />
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-[340px] lg:shrink-0">
          <div className="border-line-line1 flex flex-col gap-3 rounded-xl border bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="bg-gray-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <Bot
                  size={24}
                  className="text-gray-7"
                />
              </div>
              <div>
                <p className="text-text-main text-sm font-semibold">
                  AI 한줄 평가
                </p>
                <p className="text-gray-8 mt-1 text-sm leading-relaxed">
                  {MOCK_AI_COMMENT}
                </p>
              </div>
            </div>
          </div>

          <AiFeedbackForm attemptId={submittedResult?.attemptId} />
          {activeNextChallenge && (
            <NextChallengeCard {...activeNextChallenge} />
          )}
        </aside>
      </div>
    </main>
  );
};
