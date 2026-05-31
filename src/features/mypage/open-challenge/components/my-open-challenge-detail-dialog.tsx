'use client';

import { useState } from 'react';

import { useMyOpenChallengeDetail } from '@/features/mypage/open-challenge/hooks/use-my-open-challenges';
import { MiniSpinner } from '@/shared/components/loading';
import { Button, Dialog, StatusBadge } from '@/shared/components/ui';
import { extractText, formatDateDot } from '@/shared/lib';
import { ChevronDown, ChevronUp } from 'lucide-react';

type MyOpenChallengeDetailDialogProps = {
  challengeId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const STATUS_LABEL = {
  IN_PROGRESS: '풀이 중',
  AI_COACHING: 'AI 코칭',
  UNRESOLVED: '미완료',
  COMPLETED: '완료',
} as const;

const getResultLabel = (isCorrect: boolean | null) => {
  if (isCorrect === null) return '채점 전';
  return isCorrect ? '정답' : '오답';
};

const getResultVariant = (isCorrect: boolean | null) => {
  if (isCorrect === null) return 'default';
  return isCorrect ? 'success' : 'warning';
};

export const MyOpenChallengeDetailDialog = ({
  challengeId,
  isOpen,
  onOpenChange,
}: MyOpenChallengeDetailDialogProps) => {
  const [expandedAttemptId, setExpandedAttemptId] = useState('');
  const { data, isLoading, isError } = useMyOpenChallengeDetail(challengeId, {
    enabled: isOpen,
  });
  const completedAttempts =
    data?.attempts.filter((attempt) => attempt.status === 'COMPLETED') ?? [];
  const reviews = data?.reviews ?? [];

  const handleReviewToggle = (attemptId: string) => {
    setExpandedAttemptId((previousAttemptId) =>
      previousAttemptId === attemptId ? '' : attemptId
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="max-h-[82vh] w-full max-w-[560px] gap-5 overflow-hidden p-6">
        <Dialog.Header>
          <Dialog.Title className="text-text-main text-lg font-bold">
            내 답안 상세
          </Dialog.Title>
          <Dialog.Description className="text-gray-8 text-sm">
            제출한 답안과 공유한 풀이를 확인할 수 있어요.
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <MiniSpinner />
            </div>
          )}

          {isError && (
            <p className="text-text-sub2 py-10 text-center text-sm">
              상세 내역을 불러오지 못했습니다.
            </p>
          )}

          {data && (
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-3">
                <h4 className="font-body1-heading">답안 기록</h4>
                {completedAttempts.length > 0 ? (
                  completedAttempts.map((attempt) => (
                    <article
                      key={attempt.attemptId}
                      className="border-line-line1 rounded-xl border p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={STATUS_LABEL[attempt.status]}
                            variant={
                              attempt.status === 'COMPLETED'
                                ? 'primary'
                                : 'default'
                            }
                          />
                          <StatusBadge
                            label={getResultLabel(attempt.isCorrect)}
                            variant={getResultVariant(attempt.isCorrect)}
                          />
                          {attempt.usedAi && (
                            <StatusBadge
                              label="AI 사용"
                              variant="default"
                            />
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

                      {reviews.length > 0 && (
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="outlined"
                            size="xsmall"
                            onClick={() =>
                              handleReviewToggle(attempt.attemptId)
                            }
                          >
                            풀이 보기
                            {expandedAttemptId === attempt.attemptId ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </Button>

                          {expandedAttemptId === attempt.attemptId && (
                            <div className="mt-3 flex flex-col gap-3">
                              {reviews.map((review) => (
                                <article
                                  key={review.reviewId}
                                  className="bg-gray-1 rounded-xl p-4"
                                >
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <StatusBadge
                                      label={
                                        review.isActive ? '공개 중' : '비공개'
                                      }
                                      variant={
                                        review.isActive ? 'primary' : 'default'
                                      }
                                    />
                                    <span className="font-caption-normal text-gray-8">
                                      추천 {review.recommendCount}
                                    </span>
                                  </div>
                                  <p className="text-text-main text-sm leading-relaxed whitespace-pre-wrap">
                                    {extractText(review.content)}
                                  </p>
                                </article>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="text-gray-8 bg-gray-1 rounded-xl py-8 text-center text-sm">
                    답안 기록이 없습니다.
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
