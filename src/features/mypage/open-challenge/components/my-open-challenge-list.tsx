'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  type MyChallengeListItem,
  type MyChallengeResultFilter,
} from '@/entities/open-challenge';
import { MyOpenChallengeDetailDialog } from '@/features/mypage/open-challenge/components/my-open-challenge-detail-dialog';
import { useMyOpenChallenges } from '@/features/mypage/open-challenge/hooks/use-my-open-challenges';
import SectionContainer from '@/features/profile/components/section-container';
import { Button, StatusBadge } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn, formatDateDot } from '@/shared/lib';
import { Bot, ExternalLink, Eye, Inbox } from 'lucide-react';

type FilterOption = {
  value: MyChallengeResultFilter;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CORRECT', label: '정답' },
  { value: 'WRONG', label: '오답' },
];

const DIFFICULTY_LABEL = {
  TOP: '최상',
  HIGH: '상',
  MID: '중',
  LOW: '하',
} as const;

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

const parseResult = (value?: string | null): MyChallengeResultFilter => {
  if (value === 'CORRECT' || value === 'WRONG') return value;
  return 'ALL';
};

const getResultLabel = (challenge: MyChallengeListItem) => {
  if (challenge.isCorrect === null) return '채점 전';
  return challenge.isCorrect ? '정답' : '오답';
};

const getResultVariant = (challenge: MyChallengeListItem) => {
  if (challenge.isCorrect === null) return 'default';
  return challenge.isCorrect ? 'success' : 'warning';
};

export const MyOpenChallengeList = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selectedChallengeId, setSelectedChallengeId] = useState('');

  const currentPage = parsePage(searchParams.get('page') ?? undefined);
  const currentResult = parseResult(searchParams.get('result'));
  const { data, isLoading, isError, refetch } = useMyOpenChallenges({
    result: currentResult,
    page: currentPage - 1,
  });

  const updateParams = (next: {
    page?: number;
    result?: MyChallengeResultFilter;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'open-challenges');
    params.set('page', String(next.page ?? currentPage));
    params.set('result', next.result ?? currentResult);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <>
      <SectionContainer
        title="내 오픈챌린지 답안"
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        isOwner
        action={
          <Link
            href={PUBLIC.OPEN_CHALLENGE.LIST}
            className="font-label-normal text-key-color-primary hover:underline"
          >
            오픈챌린지 가기
          </Link>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={currentResult === option.value ? 'primary' : 'secondary'}
              size="small"
              onClick={() => updateParams({ page: 1, result: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {data && data.content.length > 0 ? (
          <div className="flex flex-col gap-3">
            {data.content.map((challenge) => (
              <article
                key={challenge.challengeId}
                className="border-line-line1 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={getResultLabel(challenge)}
                      variant={getResultVariant(challenge)}
                    />
                    <StatusBadge
                      label={DIFFICULTY_LABEL[challenge.difficulty]}
                      variant="default"
                    />
                    {challenge.usedAi && (
                      <span className="text-gray-8 bg-gray-1 inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs">
                        <Bot size={14} />
                        AI 사용
                      </span>
                    )}
                  </div>

                  <h4 className="text-text-main line-clamp-2 font-semibold">
                    {challenge.questionText}
                  </h4>
                  <p className="text-gray-8 mt-1 text-sm">
                    {challenge.sourceText} |{' '}
                    {formatDateDot(challenge.completedAt)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      setSelectedChallengeId(challenge.challengeId)
                    }
                  >
                    <Eye size={16} />
                    상세
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="small"
                  >
                    <Link
                      href={PUBLIC.OPEN_CHALLENGE.DETAIL(challenge.challengeId)}
                    >
                      <ExternalLink size={16} />
                      문제
                    </Link>
                  </Button>
                </div>
              </article>
            ))}

            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="small"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                이전
              </Button>
              <span className="text-gray-8 min-w-12 text-center text-sm">
                {currentPage}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="small"
                disabled={!data.hasNext}
                onClick={() => updateParams({ page: currentPage + 1 })}
              >
                다음
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white py-14 text-center">
            <Inbox
              size={36}
              className={cn('text-gray-6')}
            />
            <p className="font-body1-heading text-text-main">
              제출한 오픈챌린지 답안이 없습니다.
            </p>
          </div>
        )}
      </SectionContainer>

      <MyOpenChallengeDetailDialog
        challengeId={selectedChallengeId}
        isOpen={selectedChallengeId.length > 0}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedChallengeId('');
        }}
      />
    </>
  );
};
