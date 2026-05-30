'use client';

import { useState } from 'react';

import { Button, showBottomToast } from '@/shared/components/ui';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib';
import { Check, Heart, Star } from 'lucide-react';

import { useSubmitChallengeFeedbackMutation } from '../../hooks/use-open-challenge';

type AiFeedbackFormProps = {
  attemptId?: string;
};

const RATING_LABELS = [
  '전혀 도움안됨',
  '별로 도움안됨',
  '보통',
  '도움됨',
  '매우 도움됨',
];
const MAX_COMMENT_LENGTH = 200;

export const AiFeedbackForm = ({ attemptId }: AiFeedbackFormProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitFeedbackMutation = useSubmitChallengeFeedbackMutation();

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value.slice(0, MAX_COMMENT_LENGTH));
  };

  const handleSubmit = async () => {
    if (attemptId) {
      try {
        await submitFeedbackMutation.mutateAsync({
          attemptId,
          rating,
          comment,
        });
      } catch {
        return;
      }
    }

    setIsSubmitted(true);
    showBottomToast('AI 만족도 피드백이 제출되었어요.');
  };

  if (isSubmitted) {
    return (
      <div className="border-line-line1 flex flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center">
        <Heart
          size={32}
          className="text-orange-7"
          fill="currentColor"
        />
        <p className="font-body1-heading text-text-main">피드백 감사해요!</p>
        <p className="text-gray-8 text-sm">
          디에듀 AI가 더 좋아질 수 있도록 잘 활용할게요.
        </p>
      </div>
    );
  }

  return (
    <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-6">
      <div>
        <span className="bg-orange-7 rounded-md px-2 py-0.5 text-xs font-semibold text-white">
          MVP 피드백
        </span>
        <h3 className="font-body1-heading text-text-main mt-3">
          디에듀 AI는 도움이 되었나요?
        </h3>
        <p className="text-gray-8 mt-1 text-sm">
          여러분의 피드백으로 디에듀 AI가 더 좋은 학습 코치가 돼요.
        </p>
      </div>

      <div className="flex items-end justify-between">
        {RATING_LABELS.map((label, index) => {
          const score = index + 1;
          const isSelected = rating === score;
          return (
            <div
              key={score}
              className="flex flex-col items-center gap-1"
            >
              <button
                onClick={() => setRating(score)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={cn(isSelected ? 'text-yellow-400' : 'text-gray-4')}
                  fill={isSelected ? 'currentColor' : 'none'}
                />
              </button>
              <span className="text-gray-7 text-xs">{score}점</span>
              <span className="text-gray-6 text-center text-[10px] leading-tight">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="답변이 어색했던 부분이나 더 있었으면 하는 기능이 있다면 편하게 남겨주세요."
          className="h-24 resize-none text-sm"
        />
        <span className="text-gray-6 absolute right-2 bottom-2 text-xs">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitFeedbackMutation.isPending}
        className="w-full"
      >
        <Check
          size={16}
          className="mr-1"
        />
        {submitFeedbackMutation.isPending ? '제출 중...' : '피드백 제출하기'}
      </Button>
    </div>
  );
};
