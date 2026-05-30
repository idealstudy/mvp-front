'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  TextEditor,
  type TextEditorValue,
  initialTextEditorValue,
} from '@/shared/components/editor';
import { BackButton, Button, Dialog } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { Bot, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';

import {
  useOpenChallengeDetailQuery,
  useStartChallengeAttemptMutation,
  useSubmitChallengeAnswerMutation,
} from '../../hooks/use-open-challenge';
import { AiCoachPanel } from './ai-coach-panel';
import { ChallengeSolveSkeleton } from './challenge-solve-skeleton';
import { ChoiceList } from './choice-list';

type ChallengeSolveClientProps = {
  challengeId: string;
  isLoggedIn: boolean;
};

const RESULT_STORAGE_KEY_PREFIX = 'open-challenge-result';

export const ChallengeSolveClient = ({
  challengeId,
  isLoggedIn,
}: ChallengeSolveClientProps) => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [solutionContent, setSolutionContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );
  const [isQuestionOpen, setIsQuestionOpen] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isMobileAiOpen, setIsMobileAiOpen] = useState(false);
  const [aiAttemptId, setAiAttemptId] = useState<string | null>(null);
  const choiceSectionRef = useRef<HTMLDivElement>(null);

  const { data: challenge, isLoading: isChallengeLoading } =
    useOpenChallengeDetailQuery(challengeId);
  const startAttemptMutation = useStartChallengeAttemptMutation();
  const submitAnswerMutation = useSubmitChallengeAnswerMutation(challengeId);
  const isSubmitting =
    startAttemptMutation.isPending || submitAnswerMutation.isPending;

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true);
      return;
    }

    if (!selectedAnswer) {
      setSubmitError('답을 먼저 선택해 주세요.');
      choiceSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      choiceSectionRef.current?.focus();
      return;
    }

    try {
      const attemptId =
        aiAttemptId ??
        (await startAttemptMutation.mutateAsync({ challengeId })).attemptId;
      const result = await submitAnswerMutation.mutateAsync({
        attemptId,
        params: { selectedAnswer },
      });

      window.sessionStorage.setItem(
        `${RESULT_STORAGE_KEY_PREFIX}:${challengeId}`,
        JSON.stringify({ ...result, attemptId })
      );
      router.push(PUBLIC.OPEN_CHALLENGE.RESULT(challengeId));
    } catch {
      // mutation hook에서 공통 API 에러 처리를 수행한다.
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setSubmitError('');
  };

  const focusChoiceSection = () => {
    setIsMobileAiOpen(false);
    choiceSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    choiceSectionRef.current?.focus();
  };

  if (isChallengeLoading) return <ChallengeSolveSkeleton />;
  if (!challenge) return null;

  return (
    <div className="flex h-[calc(100vh-var(--spacing-header-height,64px))] overflow-hidden">
      {/* AI 코치 — 모바일에서 숨김 */}
      <aside className="border-line-line1 hidden w-[380px] shrink-0 border-r p-4 lg:block">
        <AiCoachPanel
          challengeId={challengeId}
          attemptId={aiAttemptId}
          isLoggedIn={isLoggedIn}
          onAttemptCreated={setAiAttemptId}
          onAttemptCleared={() => setAiAttemptId(null)}
          onReturnToProblem={focusChoiceSection}
        />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 문제 + 선택지 + 풀이 에디터 */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
          <div className="mb-5">
            <BackButton />
          </div>

          <div className="text-gray-8 mb-3 flex min-w-0 items-center gap-2 text-sm">
            <span>{challenge.subject}</span>
            <span>›</span>
            <span className="text-text-main truncate font-semibold">
              {challenge.topic}
            </span>
          </div>

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

          <div className="mb-5 flex flex-col gap-3">
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

          <div
            ref={choiceSectionRef}
            tabIndex={-1}
            className="flex scroll-mt-6 flex-col gap-3 outline-none"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-body1-heading text-text-main">
                답을 직접 선택해 주세요
              </p>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setIsMobileAiOpen(true)}
                className="h-9 px-3 text-sm lg:hidden"
              >
                <Bot
                  size={16}
                  className="mr-1"
                />
                AI 힌트
              </Button>
            </div>
            <ChoiceList
              choices={challenge.choices}
              selected={selectedAnswer}
              onSelect={handleAnswerSelect}
            />
            {submitError && (
              <p className="text-system-warning text-sm font-semibold">
                {submitError}
              </p>
            )}
          </div>
        </div>

        {/* 하단 제출 바 */}
        <div className="border-line-line1 flex items-center justify-end gap-3 border-t bg-white px-4 py-2 sm:px-6">
          <Button
            type="button"
            variant="outlined"
            onClick={() => setIsMobileAiOpen(true)}
            className="mr-auto h-9 px-3 text-sm lg:hidden"
          >
            <Bot
              size={16}
              className="mr-1"
            />
            AI 힌트
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="h-9 px-5 text-sm"
          >
            {isSubmitting ? '제출 중...' : '제출하기'}
          </Button>
        </div>
      </div>

      <Dialog
        isOpen={isMobileAiOpen}
        onOpenChange={setIsMobileAiOpen}
      >
        <Dialog.Content className="h-[82vh] w-full max-w-[calc(100%-2rem)] gap-3 p-4 sm:max-w-[480px]">
          <Dialog.Header>
            <div className="flex items-center justify-between gap-3">
              <Dialog.Title className="text-text-main text-base font-bold">
                AI 힌트
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setIsMobileAiOpen(false)}
                className="hover:bg-gray-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                aria-label="AI 힌트 닫기"
              >
                <X
                  size={18}
                  className="text-gray-7"
                />
              </button>
            </div>
          </Dialog.Header>
          <Dialog.Body>
            <AiCoachPanel
              challengeId={challengeId}
              attemptId={aiAttemptId}
              isLoggedIn={isLoggedIn}
              onAttemptCreated={setAiAttemptId}
              onAttemptCleared={() => setAiAttemptId(null)}
              onReturnToProblem={focusChoiceSection}
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>

      <Dialog
        isOpen={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      >
        <Dialog.Content className="w-full max-w-[360px] gap-5 p-6 text-center">
          <Dialog.Header className="items-center">
            <div className="bg-orange-1 flex h-14 w-14 items-center justify-center rounded-full">
              <Bot
                size={28}
                className="text-orange-7"
              />
            </div>
            <Dialog.Title className="text-text-main text-lg font-bold">
              로그인이 필요해요
            </Dialog.Title>
            <Dialog.Description className="text-gray-8 text-sm leading-relaxed">
              문제를 풀고 기록을 남기려면 로그인이 필요해요.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer className="flex-col">
            <Button
              type="button"
              onClick={() => router.push(PUBLIC.CORE.LOGIN)}
              className="w-full"
            >
              로그인하기
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setIsLoginDialogOpen(false)}
              className="w-full"
            >
              계속 둘러보기
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};
