'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { type AiCoachingPreference } from '@/entities/open-challenge';
import { Button } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { Bot, RotateCcw, Send, Settings } from 'lucide-react';

import {
  useAbandonAiCoachingSessionMutation,
  useAiCoachingPreferenceEnumsQuery,
  useCreateAiCoachingSessionMutation,
  useFinishAiCoachingSessionMutation,
  useMyAiCoachingPreferenceQuery,
  useSendAiCoachingMessageMutation,
  useStartChallengeAttemptMutation,
  useUpdateMyAiCoachingPreferenceMutation,
} from '../../hooks/use-open-challenge';
import {
  type AiCoachSettingOption,
  type AiCoachSettings,
  AiCoachSettingsDialog,
} from './ai-coach-settings-dialog';

type AiCoachProgressStep = 'concept' | 'approach' | 'hint' | 'final';
type AiCoachMessageRole = 'ai' | 'user';
type AiCoachStatus =
  | 'READY'
  | 'COACHING'
  | 'WAITING_ANSWER'
  | 'GUIDE_TO_PROBLEM'
  | 'FINISHED'
  | 'ABANDONED';

type AiCoachMessage = {
  id: string;
  role: AiCoachMessageRole;
  content: string;
  timestamp: string;
  step?: AiCoachProgressStep;
};

type AiCoachPanelProps = {
  challengeId: string;
  attemptId: string | null;
  isLoggedIn: boolean;
  onAttemptCreated: (attemptId: string) => void;
  onAttemptCleared: () => void;
  onReturnToProblem?: () => void;
};

const MAX_COMMENT_LENGTH = 200;

const AI_COACH_INITIAL_MESSAGE =
  '좋아요. 정답을 바로 고르기보다, 먼저 문제에서 무엇을 묻는지 같이 정리해볼게요.';

const AI_COACH_QUICK_REPLIES = ['잘 모르겠어요', '더 쉽게요', '다음 힌트'];

const toSettings = (
  preference: NonNullable<AiCoachingPreference>
): AiCoachSettings => ({
  subject: '수학',
  learningStage:
    (preference.learningStage?.code as AiCoachSettings['learningStage']) ??
    'CONCEPT_FOCUSED',
  learningGoal:
    (preference.learningGoal?.code as AiCoachSettings['learningGoal']) ??
    'CSAT',
  difficultAreas: preference.difficultAreas.map(
    (area) => area.code as AiCoachSettings['difficultAreas'][number]
  ),
  customText: preference.customText ?? '',
  skipped: false,
});

const toPreferencePayload = (settings: AiCoachSettings) => ({
  learningStage: settings.learningStage,
  learningGoal: settings.learningGoal,
  difficultAreas: settings.difficultAreas,
  customText: settings.customText,
});

const toDialogOptions = <TValue extends string>(
  options?: { code: string; label: string }[]
): AiCoachSettingOption<TValue>[] | undefined =>
  options?.map((option) => ({
    value: option.code as TValue,
    label: option.label,
  }));

const toProgressStep = (
  progressionStep?: number | null
): AiCoachProgressStep | undefined => {
  switch (progressionStep) {
    case 1:
      return 'concept';
    case 2:
      return 'approach';
    case 3:
      return 'hint';
    case 4:
      return 'final';
    default:
      return undefined;
  }
};

const getDifficultAreaLabel = (
  area: AiCoachSettings['difficultAreas'][number]
) => {
  switch (area) {
    case 'CONCEPT':
      return '개념 이해';
    case 'INTERPRET':
      return '문제 해석';
    case 'APPLICATION':
      return '개념 적용';
    case 'CALCULATION':
      return '계산';
  }
};

const getIntroMessage = (settings: AiCoachSettings) => {
  if (settings.skipped) return AI_COACH_INITIAL_MESSAGE;

  const goalLabel =
    settings.learningGoal === 'CSAT' ? '수능형 접근' : '내신형 정확성';
  const stageLabel =
    settings.learningStage === 'CONCEPT_FOCUSED' ? '개념 설명' : '풀이 접근';
  const difficultAreaText =
    settings.difficultAreas.length > 0
      ? ` 특히 ${settings.difficultAreas
          .map(getDifficultAreaLabel)
          .join(', ')} 부분을 더 신경 쓸게요.`
      : '';

  return `${AI_COACH_INITIAL_MESSAGE}\n${stageLabel}과 ${goalLabel}에 맞춰 힌트를 줄게요.${difficultAreaText}`;
};

const getProgressStepLabel = (step: AiCoachProgressStep) => {
  switch (step) {
    case 'concept':
      return '1단계 · 개념 이해';
    case 'approach':
      return '2단계 · 접근 방향';
    case 'hint':
      return '3단계 · 풀이 힌트';
    case 'final':
      return '4단계 · 답 직전 힌트';
  }
};

const getStatusLabel = (status: AiCoachStatus) => {
  switch (status) {
    case 'READY':
      return '시작 전';
    case 'COACHING':
      return '코칭 중';
    case 'WAITING_ANSWER':
      return '답변 대기';
    case 'GUIDE_TO_PROBLEM':
      return '답 선택 유도';
    case 'FINISHED':
      return '종료';
    case 'ABANDONED':
      return '중단';
  }
};

export const AiCoachPanel = ({
  challengeId,
  attemptId,
  isLoggedIn,
  onAttemptCreated,
  onAttemptCleared,
  onReturnToProblem,
}: AiCoachPanelProps) => {
  const [messages, setMessages] = useState<AiCoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [status, setStatus] = useState<AiCoachStatus>('READY');
  const [settings, setSettings] = useState<AiCoachSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const preferenceEnumsQuery = useAiCoachingPreferenceEnumsQuery({
    enabled: isLoggedIn,
  });
  const myPreferenceQuery = useMyAiCoachingPreferenceQuery({
    enabled: isLoggedIn,
  });
  const startAttemptMutation = useStartChallengeAttemptMutation();
  const updatePreferenceMutation = useUpdateMyAiCoachingPreferenceMutation();
  const createSessionMutation = useCreateAiCoachingSessionMutation();
  const sendMessageMutation = useSendAiCoachingMessageMutation(sessionId);
  const finishSessionMutation = useFinishAiCoachingSessionMutation();
  const abandonSessionMutation = useAbandonAiCoachingSessionMutation();

  const hasLoadedSettings =
    !isLoggedIn || myPreferenceQuery.isFetched || myPreferenceQuery.isError;
  const isBusy =
    startAttemptMutation.isPending ||
    updatePreferenceMutation.isPending ||
    createSessionMutation.isPending ||
    sendMessageMutation.isPending ||
    finishSessionMutation.isPending ||
    abandonSessionMutation.isPending;

  useEffect(() => {
    if (myPreferenceQuery.data && !settings) {
      setSettings(toSettings(myPreferenceQuery.data));
    }
  }, [myPreferenceQuery.data, settings]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimestamp = () =>
    new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const createAiMessage = (
    content: string,
    step?: AiCoachProgressStep
  ): AiCoachMessage => ({
    id: `ai-${Date.now()}-${Math.random()}`,
    role: 'ai',
    content,
    timestamp: getTimestamp(),
    step,
  });

  const startCoach = async (nextSettings: AiCoachSettings) => {
    try {
      setSettings(nextSettings);
      if (!nextSettings.skipped) {
        await updatePreferenceMutation.mutateAsync(
          toPreferencePayload(nextSettings)
        );
      }

      const currentAttemptId =
        attemptId ??
        (
          await startAttemptMutation.mutateAsync({
            challengeId,
          })
        ).attemptId;

      if (!attemptId) {
        onAttemptCreated(currentAttemptId);
      }

      const session = await createSessionMutation.mutateAsync({
        challengeAttemptId: currentAttemptId,
      });

      setSessionId(session.sessionId);
      setMessages([createAiMessage(getIntroMessage(nextSettings))]);
      setStatus('WAITING_ANSWER');
      setIsSettingsOpen(false);
    } catch {
      // mutation hook에서 공통 API 에러 처리를 수행한다.
    }
  };

  const handleStartClick = () => {
    if (!hasLoadedSettings) return;
    if (!settings) {
      setIsSettingsOpen(true);
      return;
    }
    startCoach(settings);
  };

  const handleSkipSettings = () => {
    startCoach({
      subject: '수학',
      learningStage: 'CONCEPT_FOCUSED',
      learningGoal: 'CSAT',
      difficultAreas: [],
      customText: '',
      skipped: true,
    });
  };

  const handleSettingsSubmit = async (nextSettings: AiCoachSettings) => {
    if (status === 'READY') {
      await startCoach(nextSettings);
      return;
    }

    try {
      setSettings(nextSettings);
      await updatePreferenceMutation.mutateAsync(
        toPreferencePayload(nextSettings)
      );
      setIsSettingsOpen(false);
    } catch {
      // mutation hook에서 공통 API 에러 처리를 수행한다.
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || status === 'READY' || !sessionId) return;
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedMessage,
        timestamp: getTimestamp(),
      },
    ]);
    setInputMessage('');
    setStatus('COACHING');

    sendMessageMutation.mutate(
      { message: trimmedMessage },
      {
        onSuccess: (response) => {
          setMessages((previousMessages) => [
            ...previousMessages,
            createAiMessage(
              response.reply,
              toProgressStep(response.progressionStep)
            ),
          ]);
          setStatus(response.status);
        },
        onError: () => {
          setMessages((previousMessages) => [
            ...previousMessages,
            createAiMessage(
              '지금은 AI 코치 응답을 불러오지 못했어요. 잠시 후 다시 보내주세요.'
            ),
          ]);
          setStatus('WAITING_ANSWER');
        },
      }
    );
  };

  const handleFinishAndReturn = () => {
    if (!sessionId) {
      onReturnToProblem?.();
      return;
    }

    finishSessionMutation.mutate(sessionId, {
      onSuccess: () => {
        setStatus('FINISHED');
        onReturnToProblem?.();
      },
    });
  };

  const handleRestart = () => {
    if (sessionId && status !== 'FINISHED' && status !== 'ABANDONED') {
      abandonSessionMutation.mutate(sessionId);
    }
    setMessages([]);
    setSessionId('');
    setStatus('READY');
    onAttemptCleared();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value.slice(0, MAX_COMMENT_LENGTH));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSendMessage();
  };

  const handleQuickReply = (replyText: string) => {
    setInputMessage(replyText);
  };

  const enumOptions = preferenceEnumsQuery.data;

  if (!isLoggedIn) {
    return (
      <div className="border-line-line1 flex h-full flex-col items-center justify-center gap-4 rounded-xl border bg-white p-8 text-center">
        <div className="bg-gray-1 flex h-16 w-16 items-center justify-center rounded-full">
          <Bot
            size={32}
            className="text-gray-7"
          />
        </div>
        <div>
          <p className="font-body1-heading text-text-main">AI 코치</p>
          <p className="text-gray-8 mt-1 text-sm">
            로그인하면 AI 코치와 함께
            <br />
            문제를 풀 수 있어요.
          </p>
        </div>
        <Button
          asChild
          className="w-full"
        >
          <Link href={PUBLIC.CORE.LOGIN}>로그인하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border-line-line1 flex h-full flex-col rounded-xl border bg-white">
        <div className="border-line-line1 flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                status === 'READY' ? 'bg-gray-5' : 'bg-orange-7'
              )}
            />
            <span className="font-body1-heading text-text-main">AI 코치</span>
            {status !== 'READY' && (
              <span className="text-gray-7 truncate text-xs">
                {getStatusLabel(status)}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:bg-gray-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              aria-label="AI 코치 맞춤 설정 수정"
            >
              <Settings
                size={16}
                className="text-gray-7"
              />
            </button>
            {status !== 'READY' && (
              <button
                type="button"
                onClick={handleRestart}
                className="hover:bg-gray-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                aria-label="AI 코치 다시 시작"
              >
                <RotateCcw
                  size={16}
                  className="text-gray-7"
                />
              </button>
            )}
          </div>
        </div>

        {status === 'READY' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="bg-orange-1 flex h-16 w-16 items-center justify-center rounded-full">
              <Bot
                size={32}
                className="text-orange-7"
              />
            </div>
            <div>
              <p className="font-body1-heading text-text-main">
                막히는 지점부터 같이 생각해요
              </p>
              <p className="text-gray-8 mt-2 text-sm leading-relaxed">
                AI 코치는 정답을 알려주지 않고,
                <br />
                직접 답을 고를 수 있게 힌트를 나눠서 줘요.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleStartClick}
              disabled={!hasLoadedSettings || isBusy}
              className="w-full"
            >
              {isBusy ? 'AI 코치 준비 중...' : 'AI 힌트 받기'}
            </Button>
            {settings && (
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="text-orange-7 cursor-pointer text-sm font-semibold"
              >
                맞춤 설정 수정
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              ref={scrollAreaRef}
              className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user'
                      ? 'justify-end'
                      : 'items-start gap-2'
                  )}
                >
                  {message.role === 'ai' && (
                    <div className="bg-gray-1 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      <Bot
                        size={16}
                        className="text-gray-7"
                      />
                    </div>
                  )}
                  <div
                    className={cn(
                      'flex max-w-[80%] flex-col gap-1',
                      message.role === 'user' && 'items-end'
                    )}
                  >
                    {message.step && (
                      <span className="text-orange-7 text-xs font-semibold">
                        {getProgressStepLabel(message.step)}
                      </span>
                    )}
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
                        message.role === 'ai'
                          ? 'bg-gray-1 text-text-main rounded-tl-none'
                          : 'bg-orange-7 rounded-tr-none text-white'
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="text-gray-6 text-xs">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {status === 'GUIDE_TO_PROBLEM' && (
              <div className="border-line-line1 border-t px-4 py-3">
                <Button
                  type="button"
                  onClick={handleFinishAndReturn}
                  disabled={finishSessionMutation.isPending}
                  className="w-full"
                >
                  문제로 돌아가 답 선택하기
                </Button>
              </div>
            )}

            <div className="flex gap-2 px-4 pb-2">
              {AI_COACH_QUICK_REPLIES.map((replyOption) => (
                <button
                  key={replyOption}
                  type="button"
                  onClick={() => handleQuickReply(replyOption)}
                  className="border-line-line2 hover:bg-gray-1 flex-1 cursor-pointer rounded-full border px-2 py-1.5 text-xs"
                >
                  {replyOption}
                </button>
              ))}
            </div>

            <div className="border-line-line1 flex items-center gap-2 border-t px-4 py-3">
              <input
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={status === 'COACHING' || isBusy}
                placeholder={
                  status === 'COACHING'
                    ? 'AI 코치가 생각 중이에요...'
                    : '메시지를 입력하세요...'
                }
                className="placeholder:text-gray-6 flex-1 text-sm outline-none disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  !inputMessage.trim() || status === 'COACHING' || isBusy
                }
                className="bg-orange-7 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="AI 코치에게 메시지 보내기"
              >
                <Send size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      <AiCoachSettingsDialog
        isOpen={isSettingsOpen}
        initialSettings={settings}
        learningStageOptions={toDialogOptions(enumOptions?.learningStage)}
        learningGoalOptions={toDialogOptions(enumOptions?.learningGoal)}
        difficultAreaOptions={toDialogOptions(enumOptions?.difficultArea)}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={handleSettingsSubmit}
        onSkip={
          status === 'READY'
            ? handleSkipSettings
            : () => setIsSettingsOpen(false)
        }
      />
    </>
  );
};
