import Link from 'next/link';

import { AiFeedbackForm } from './ai-feedback-form';
import { NextChallengeCard } from './next-challenge-card';
import { ResultStats } from './result-stats';
import { type SolutionItem } from './solution-list';
import { SolutionList } from './solution-list';

const MOCK_TOTAL_SOLUTION_COUNT = 36;
const MOCK_AI_COMMENT =
  '잘했어요! 기본 개념을 정확히 이해하고 계산도 깔끔하게 마무리했어요. 👏 이런 문제는 자신감 포인트예요!';

type ChallengeResultProps = {
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

export const ChallengeResult = ({
  result,
  solutions,
  nextChallenge,
}: ChallengeResultProps) => {
  return (
    <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/open-challenge"
          className="text-gray-8 hover:text-text-main flex items-center gap-1 text-sm"
        >
          ← 오픈 챌린지
        </Link>
        <div className="flex items-center gap-3">
          <button className="text-gray-8 hover:text-text-main flex items-center gap-1 text-sm">
            🔖 북마크
          </button>
          <button className="text-gray-8 hover:text-text-main">⋯</button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ResultStats
            isCorrect={result.isCorrect}
            correctAnswer={result.correctAnswer}
            passRate={result.passRate}
            participantCount={result.participantCount}
          />
          <SolutionList
            solutions={solutions}
            totalCount={MOCK_TOTAL_SOLUTION_COUNT}
          />
        </div>

        <aside className="flex w-[340px] shrink-0 flex-col gap-4">
          <div className="border-line-line1 flex flex-col gap-3 rounded-xl border bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="bg-gray-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl">
                🤖
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

          <AiFeedbackForm />
          <NextChallengeCard {...nextChallenge} />
        </aside>
      </div>
    </main>
  );
};
