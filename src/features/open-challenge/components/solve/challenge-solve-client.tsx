'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { type ChallengeDetailMock } from '../../mock/challenge-detail';
import { AiCoachPanel } from './ai-coach-panel';
import { ChoiceList } from './choice-list';

type DrawTool = '펜' | '지우개' | '선택';

const DRAW_TOOLS: DrawTool[] = ['펜', '지우개', '선택'];
const DRAW_TOOL_ICONS: Record<DrawTool, string> = {
  펜: '✏',
  지우개: '⌫',
  선택: '↖',
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
      {/* 좌측: AI 코치 */}
      <aside className="border-line-line1 w-[380px] shrink-0 border-r p-4">
        <AiCoachPanel isLoggedIn={isLoggedIn} />
      </aside>

      {/* 우측: 문제 풀이 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 상단 바 */}
        <div className="border-line-line1 flex items-center justify-between border-b px-6 py-3">
          <div className="text-gray-8 flex items-center gap-2 text-sm">
            <span>{challenge.subject}</span>
            <span>›</span>
            <span className="text-text-main font-semibold">
              {challenge.topic}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-8 hover:text-text-main flex items-center gap-1 text-sm">
              ⚠ 문제 신고
            </button>
            <button className="text-gray-8 hover:text-text-main">⋯</button>
          </div>
        </div>

        {/* 문제 + 선택지 + 캔버스 */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="border-line-line1 mb-5 rounded-xl border bg-white px-8 py-6">
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

          {/* 풀이 캔버스 플레이스홀더 */}
          <div className="border-line-line2 flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-white">
            <span className="text-gray-5 text-3xl">✏</span>
            <p className="font-body2-heading text-gray-8">풀이 적어봐요</p>
            <p className="text-gray-6 text-sm">
              여기에 자유롭게 그림이나 식을 작성해보세요.
            </p>
          </div>
        </div>

        {/* 하단 툴바 */}
        <div className="border-line-line1 flex items-center gap-4 border-t bg-white px-6 py-3">
          <div className="flex gap-1">
            {DRAW_TOOLS.map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                  activeTool === tool
                    ? 'bg-orange-1 text-orange-7 font-semibold'
                    : 'text-gray-8 hover:bg-gray-1'
                }`}
              >
                <span className="text-base">{DRAW_TOOL_ICONS[tool]}</span>
                {tool}
              </button>
            ))}
          </div>

          <div className="bg-line-line1 mx-2 h-6 w-px" />

          <div className="flex items-center gap-2">
            {COLOR_OPTIONS.map((colorValue) => (
              <button
                key={colorValue}
                onClick={() => setActiveColor(colorValue)}
                style={{ backgroundColor: colorValue }}
                className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${
                  activeColor === colorValue
                    ? 'ring-gray-7 ring-2 ring-offset-1'
                    : ''
                }`}
              />
            ))}
          </div>

          <div className="bg-line-line1 mx-2 h-6 w-px" />

          <button
            onClick={handleClearCanvas}
            className="text-gray-8 hover:text-text-main flex items-center gap-1 text-sm"
          >
            🗑 전체 지우기
          </button>

          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-orange-7 ml-auto rounded-lg px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};
