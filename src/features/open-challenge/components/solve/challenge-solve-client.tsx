'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  TextEditor,
  type TextEditorValue,
  initialTextEditorValue,
} from '@/shared/components/editor';
import { BackButton, Button } from '@/shared/components/ui';
import { AlertTriangle, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

import { type ChallengeDetailMock } from '../../mock/challenge-detail';
import { AiCoachPanel } from './ai-coach-panel';
import { ChoiceList } from './choice-list';

type ChallengeSolveClientProps = {
  challengeId: string;
  challenge: ChallengeDetailMock;
  isLoggedIn: boolean;
};

export const ChallengeSolveClient = ({
  challengeId,
  challenge,
  isLoggedIn,
}: ChallengeSolveClientProps) => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [solutionContent, setSolutionContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );
  const [isQuestionOpen, setIsQuestionOpen] = useState(true);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    router.push(`/open-challenge/${challengeId}/result`);
  };

  return (
    <div className="flex h-[calc(100vh-var(--spacing-header-height,64px))] overflow-hidden">
      {/* AI 코치 — 모바일에서 숨김 */}
      <aside className="border-line-line1 hidden w-[380px] shrink-0 border-r p-4 lg:block">
        <AiCoachPanel isLoggedIn={isLoggedIn} />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 상단 바 */}
        <div className="border-line-line1 flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BackButton className="shrink-0" />
            <div className="text-gray-8 flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden sm:inline">{challenge.subject}</span>
              <span className="hidden sm:inline">›</span>
              <span className="text-text-main truncate font-semibold">
                {challenge.topic}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button className="text-gray-8 hover:text-text-main flex cursor-pointer items-center gap-1 text-sm">
              <AlertTriangle size={14} />
              <span className="hidden sm:inline">문제 신고</span>
            </button>
          </div>
        </div>

        {/* 문제 + 선택지 + 풀이 에디터 */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
          <div className="border-line-line1 mb-5 overflow-hidden rounded-xl border bg-white">
            <button
              type="button"
              onClick={() =>
                setIsQuestionOpen(
                  (previousIsQuestionOpen) => !previousIsQuestionOpen
                )
              }
              className="hover:bg-gray-1 flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
              aria-expanded={isQuestionOpen}
            >
              <div className="min-w-0">
                <p className="text-gray-8 text-xs font-semibold">
                  문제 {challenge.questionNumber}
                </p>
                <p className="text-text-main mt-1 truncate text-base font-bold">
                  {challenge.topic}
                </p>
              </div>
              {isQuestionOpen ? (
                <ChevronUp
                  size={20}
                  className="text-gray-7 shrink-0"
                />
              ) : (
                <ChevronDown
                  size={20}
                  className="text-gray-7 shrink-0"
                />
              )}
            </button>

            {isQuestionOpen && (
              <div className="border-line-line1 border-t px-5 py-5 sm:px-6">
                <p className="font-body1-heading text-text-main text-lg leading-relaxed whitespace-pre-line">
                  <span className="text-orange-7 mr-2">
                    {challenge.questionNumber}.
                  </span>
                  {challenge.questionText}
                </p>
                {challenge.questionImageUrl && (
                  <div className="border-line-line2 bg-gray-1 mt-5 overflow-hidden rounded-lg border p-3">
                    <Image
                      src={challenge.questionImageUrl}
                      alt={`${challenge.topic} 문제 이미지`}
                      width={760}
                      height={420}
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-5">
            <ChoiceList
              choices={challenge.choices}
              selected={selectedAnswer}
              onSelect={setSelectedAnswer}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Pencil
                size={18}
                className="text-orange-7"
              />
              <p className="font-body1-heading text-text-main">풀이 공간</p>
            </div>
            <TextEditor
              value={solutionContent}
              onChange={setSolutionContent}
              placeholder="식, 풀이 과정, 떠오른 단서를 자유롭게 적어보세요."
              minHeight="420px"
              maxHeight="none"
              ariaLabel="오픈 챌린지 풀이 입력"
            />
          </div>
        </div>

        {/* 하단 제출 바 */}
        <div className="border-line-line1 flex items-center justify-end border-t bg-white px-4 py-3 sm:px-6">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            제출하기
          </Button>
        </div>
      </div>
    </div>
  );
};
