'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui';
import {
  AlertTriangle,
  Eraser,
  MoreHorizontal,
  MousePointer2,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { type ChallengeDetailMock } from '../../mock/challenge-detail';
import { AiCoachPanel } from './ai-coach-panel';
import { ChoiceList } from './choice-list';

type DrawTool = '펜' | '지우개' | '선택';

const DRAW_TOOLS: DrawTool[] = ['펜', '지우개', '선택'];
const DRAW_TOOL_ICONS: Record<DrawTool, LucideIcon> = {
  펜: Pencil,
  지우개: Eraser,
  선택: MousePointer2,
};
const COLOR_OPTIONS = ['#000000', '#ff4805', '#3b82f6', '#22c55e', '#9ca3af'];

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
  const [activeTool, setActiveTool] = useState<DrawTool>('펜');
  const [activeColor, setActiveColor] = useState('#000000');

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    router.push(`/open-challenge/${challengeId}/result`);
  };

  const handleClearCanvas = () => {
    // TODO: 캔버스 초기화 로직
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
          <div className="text-gray-8 flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden sm:inline">{challenge.subject}</span>
            <span className="hidden sm:inline">›</span>
            <span className="text-text-main truncate font-semibold">
              {challenge.topic}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button className="text-gray-8 hover:text-text-main flex cursor-pointer items-center gap-1 text-sm">
              <AlertTriangle size={14} />
              <span className="hidden sm:inline">문제 신고</span>
            </button>
            <button className="text-gray-8 hover:text-text-main cursor-pointer">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* 문제 + 선택지 + 캔버스 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="border-line-line1 mb-5 rounded-xl border bg-white px-6 py-6 sm:px-8">
            <p className="font-body1-heading text-text-main text-lg">
              <span className="text-orange-7 mr-2">
                {challenge.questionNumber}.
              </span>
              {challenge.questionText}
            </p>
          </div>

          <div className="mb-5">
            <ChoiceList
              choices={challenge.choices}
              selected={selectedAnswer}
              onSelect={setSelectedAnswer}
            />
          </div>

          <div className="border-line-line2 flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-white">
            <Pencil
              size={32}
              className="text-gray-5"
            />
            <p className="font-body2-heading text-gray-8">풀이 적어봐요</p>
            <p className="text-gray-6 text-sm">
              여기에 자유롭게 그림이나 식을 작성해보세요.
            </p>
          </div>
        </div>

        {/* 하단 툴바 */}
        <div className="border-line-line1 flex flex-wrap items-center gap-3 border-t bg-white px-4 py-3 sm:gap-4 sm:px-6">
          <div className="flex gap-1">
            {DRAW_TOOLS.map((tool) => {
              const Icon = DRAW_TOOL_ICONS[tool];
              return (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool)}
                  className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                    activeTool === tool
                      ? 'bg-orange-1 text-orange-7 font-semibold'
                      : 'text-gray-8 hover:bg-gray-1'
                  }`}
                >
                  <Icon size={16} />
                  {tool}
                </button>
              );
            })}
          </div>

          <div className="bg-line-line1 mx-1 h-6 w-px" />

          <div className="flex items-center gap-2">
            {COLOR_OPTIONS.map((colorValue) => (
              <button
                key={colorValue}
                onClick={() => setActiveColor(colorValue)}
                style={{ backgroundColor: colorValue }}
                className={`h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                  activeColor === colorValue
                    ? 'ring-gray-7 ring-2 ring-offset-1'
                    : ''
                }`}
              />
            ))}
          </div>

          <div className="bg-line-line1 mx-1 h-6 w-px" />

          <button
            onClick={handleClearCanvas}
            className="text-gray-8 hover:text-text-main flex cursor-pointer items-center gap-1 text-sm"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">전체 지우기</span>
          </button>

          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="ml-auto"
          >
            제출하기
          </Button>
        </div>
      </div>
    </div>
  );
};
