'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
  type ChallengeDetail,
  type MyChallengeDetail,
} from '@/entities/open-challenge';
import { MiniSpinner } from '@/shared/components/loading';
import { Dialog, StatusBadge } from '@/shared/components/ui';
import { extractText, formatDateDot } from '@/shared/lib';
import { Bot } from 'lucide-react';

import { useMyOpenChallengeDetailQuery } from '../../hooks/use-open-challenge';

type ChallengeHistoryDialogProps = {
  challengeId: string;
  challenge: ChallengeDetail;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type ReviewItem = MyChallengeDetail['reviews'][number];

const getResultLabel = (isCorrect: boolean | null) => {
  if (isCorrect === null) return '채점 전';
  return isCorrect ? '정답' : '오답';
};

const getResultVariant = (isCorrect: boolean | null) => {
  if (isCorrect === null) return 'default';
  return isCorrect ? 'success' : 'warning';
};

const SolutionPreview = ({
  review,
  isExpanded,
  onToggle,
}: {
  review: ReviewItem;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const content = extractText(review.content);
  const isLong = content.length > 120 || content.split('\n').length > 3;

  return (
    <article className="bg-gray-1/50 rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge
          label={review.isActive ? '공개 중' : '비공개'}
          variant={review.isActive ? 'primary' : 'default'}
        />
        <span className="font-caption-normal text-gray-8">
          추천 {review.recommendCount}
        </span>
      </div>
      <p
        className={
          isExpanded
            ? 'text-text-main text-sm leading-relaxed whitespace-pre-wrap'
            : 'text-text-main line-clamp-3 text-sm leading-relaxed whitespace-pre-wrap'
        }
      >
        {content}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-7 hover:text-text-main mt-2 cursor-pointer text-xs font-semibold"
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </article>
  );
};

export const ChallengeHistoryDialog = ({
  challengeId,
  challenge,
  isOpen,
  onOpenChange,
}: ChallengeHistoryDialogProps) => {
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(
    new Set()
  );
  const { data, isLoading, isError } = useMyOpenChallengeDetailQuery(
    challengeId,
    { enabled: isOpen }
  );
  const completedAttempts =
    data?.attempts.filter((attempt) => attempt.status === 'COMPLETED') ?? [];
  const reviews = data?.reviews ?? [];

  const toggleReview = (reviewId: string) => {
    setExpandedReviewIds((previousIds) => {
      const nextIds = new Set(previousIds);
      if (nextIds.has(reviewId)) nextIds.delete(reviewId);
      else nextIds.add(reviewId);
      return nextIds;
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="h-[82vh] w-[min(calc(100vw-2rem),720px)] max-w-none gap-5 overflow-hidden p-6">
        <Dialog.Header className="shrink-0">
          <Dialog.Title className="text-text-main text-lg font-bold">
            도전 내역
          </Dialog.Title>
          <Dialog.Description className="text-gray-8 text-sm">
            이 문제에 제출했던 답안과 공유한 풀이를 확인할 수 있어요.
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="min-h-0 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex justify-center py-12">
              <MiniSpinner />
            </div>
          )}

          {isError && (
            <p className="text-text-sub2 py-10 text-center text-sm">
              도전 내역을 불러오지 못했습니다.
            </p>
          )}

          {data && (
            <div className="flex flex-col gap-5">
              <section className="border-line-line1 rounded-xl border bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={challenge.subject}
                    variant="default"
                  />
                  <span className="text-gray-8 text-sm">{challenge.topic}</span>
                </div>
                <p className="text-text-main text-base leading-relaxed whitespace-pre-line">
                  {challenge.questionText}
                </p>
                {challenge.questionImageUrl && (
                  <div className="border-line-line2 bg-gray-1 mt-4 overflow-hidden rounded-lg border p-3">
                    <Image
                      src={challenge.questionImageUrl}
                      alt={`${challenge.topic} 문제 이미지`}
                      width={640}
                      height={360}
                      className="max-h-[320px] w-full object-contain"
                    />
                  </div>
                )}
              </section>

              <section className="flex flex-col gap-3">
                <h4 className="font-body1-heading">제출 내역</h4>
                {completedAttempts.length > 0 ? (
                  completedAttempts.map((attempt, attemptIndex) => (
                    <article
                      key={attempt.attemptId}
                      className="border-line-line1 rounded-xl border bg-white p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={getResultLabel(attempt.isCorrect)}
                            variant={getResultVariant(attempt.isCorrect)}
                          />
                          {attempt.usedAi && (
                            <span className="text-gray-8 bg-gray-1 inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs">
                              <Bot size={14} />
                              AI 사용
                            </span>
                          )}
                        </div>
                        {attempt.completedAt && (
                          <span className="font-caption-normal text-gray-8">
                            {formatDateDot(attempt.completedAt)}
                          </span>
                        )}
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-gray-8">선택 답안</dt>
                          <dd className="text-text-main mt-1 font-semibold">
                            {attempt.selectedAnswer ?? '-'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-8">최대 힌트 단계</dt>
                          <dd className="text-text-main mt-1 font-semibold">
                            {attempt.maxUsedHintStep ?? '-'}
                          </dd>
                        </div>
                      </dl>

                      {attemptIndex === 0 && reviews.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                          {reviews.map((review) => (
                            <SolutionPreview
                              key={review.reviewId}
                              review={review}
                              isExpanded={expandedReviewIds.has(
                                review.reviewId
                              )}
                              onToggle={() => toggleReview(review.reviewId)}
                            />
                          ))}
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="text-gray-8 bg-gray-1 rounded-xl py-8 text-center text-sm">
                    제출 완료된 답안이 없습니다.
                  </p>
                )}
              </section>
            </div>
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
};
