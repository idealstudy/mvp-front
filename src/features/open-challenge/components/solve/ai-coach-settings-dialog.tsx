'use client';

import { useState } from 'react';

import { Button, Dialog, Textarea } from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { BookOpen, Check, Target, X } from 'lucide-react';

export type AiCoachSettings = {
  subject: '수학';
  learningStage: 'concept' | 'approach';
  learningGoal: 'exam' | 'school';
  difficultAreas: string[];
  customText: string;
  skipped: boolean;
};

type AiCoachSettingsDialogProps = {
  isOpen: boolean;
  initialSettings: AiCoachSettings | null;
  onClose: () => void;
  onSubmit: (settings: AiCoachSettings) => void;
  onSkip: () => void;
};

const LEARNING_STAGES = [
  {
    value: 'concept',
    label: '개념 설명 강화',
    description: '개념을 먼저 짚고 천천히 접근해요.',
  },
  {
    value: 'approach',
    label: '풀이 접근 중심',
    description: '풀이 방향과 단서를 먼저 잡아요.',
  },
] as const;

const LEARNING_GOALS = [
  {
    value: 'exam',
    label: '수능 중심',
    description: '낯선 문제 접근과 응용 사고를 강조해요.',
  },
  {
    value: 'school',
    label: '내신 중심',
    description: '정확한 풀이 패턴과 실수 방지를 강조해요.',
  },
] as const;

const DIFFICULT_AREAS = ['개념 이해', '문제 해석', '응용 문제', '계산'];
const MAX_CUSTOM_TEXT_LENGTH = 120;

const DEFAULT_SETTINGS: AiCoachSettings = {
  subject: '수학',
  learningStage: 'concept',
  learningGoal: 'exam',
  difficultAreas: [],
  customText: '',
  skipped: false,
};

export const AiCoachSettingsDialog = ({
  isOpen,
  initialSettings,
  onClose,
  onSubmit,
  onSkip,
}: AiCoachSettingsDialogProps) => {
  const [settings, setSettings] = useState<AiCoachSettings>(
    initialSettings ?? DEFAULT_SETTINGS
  );

  const handleAreaToggle = (area: string) => {
    setSettings((previousSettings) => {
      const hasArea = previousSettings.difficultAreas.includes(area);
      return {
        ...previousSettings,
        difficultAreas: hasArea
          ? previousSettings.difficultAreas.filter(
              (difficultArea) => difficultArea !== area
            )
          : [...previousSettings.difficultAreas, area],
      };
    });
  };

  const handleSubmit = () => {
    onSubmit({ ...settings, skipped: false });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(nextIsOpen) => {
        if (!nextIsOpen) onClose();
      }}
    >
      <Dialog.Content className="w-full max-w-[560px] gap-6 p-6 sm:p-8">
        <Dialog.Header>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-text-main text-xl font-bold">
                AI 코치 맞춤 설정
              </Dialog.Title>
              <Dialog.Description className="text-gray-8 mt-2 text-sm leading-relaxed">
                문제마다 어려운 부분이 다를 수 있어요. 지금 필요한 힌트 방향을
                알려주세요.
              </Dialog.Description>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-gray-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
              aria-label="맞춤 설정 닫기"
            >
              <X
                size={18}
                className="text-gray-7"
              />
            </button>
          </div>
        </Dialog.Header>

        <Dialog.Body className="gap-6">
          <section className="flex flex-col gap-2">
            <p className="text-text-main text-sm font-semibold">과목</p>
            <div className="border-line-line1 bg-gray-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
              <BookOpen
                size={16}
                className="text-orange-7"
              />
              수학
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="text-text-main text-sm font-semibold">학습 단계</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LEARNING_STAGES.map((stage) => (
                <OptionButton
                  key={stage.value}
                  label={stage.label}
                  description={stage.description}
                  selected={settings.learningStage === stage.value}
                  onClick={() =>
                    setSettings((previousSettings) => ({
                      ...previousSettings,
                      learningStage: stage.value,
                    }))
                  }
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="text-text-main text-sm font-semibold">학습 목적</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LEARNING_GOALS.map((goal) => (
                <OptionButton
                  key={goal.value}
                  label={goal.label}
                  description={goal.description}
                  selected={settings.learningGoal === goal.value}
                  onClick={() =>
                    setSettings((previousSettings) => ({
                      ...previousSettings,
                      learningGoal: goal.value,
                    }))
                  }
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="text-text-main text-sm font-semibold">어려운 부분</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULT_AREAS.map((area) => {
                const isSelected = settings.difficultAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => handleAreaToggle(area)}
                    className={cn(
                      'flex cursor-pointer items-center gap-1 rounded-full border px-3 py-2 text-sm transition-colors',
                      isSelected
                        ? 'border-orange-7 bg-orange-1 text-orange-7'
                        : 'border-line-line2 hover:bg-gray-1 text-gray-8 bg-white'
                    )}
                  >
                    {isSelected && <Check size={14} />}
                    {area}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-text-main text-sm font-semibold">자유 입력</p>
              <span className="text-gray-6 text-xs">
                {settings.customText.length}/{MAX_CUSTOM_TEXT_LENGTH}
              </span>
            </div>
            <Textarea
              value={settings.customText}
              onChange={(event) =>
                setSettings((previousSettings) => ({
                  ...previousSettings,
                  customText: event.target.value.slice(
                    0,
                    MAX_CUSTOM_TEXT_LENGTH
                  ),
                }))
              }
              placeholder="예) 함수 문제에서 항상 막혀요. 개념은 아는데 적용이 어려워요."
              className="h-24 resize-none text-sm"
            />
          </section>
        </Dialog.Body>

        <Dialog.Footer className="flex-col-reverse sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outlined"
            onClick={onSkip}
            className="w-full sm:w-auto"
          >
            나중에 할게요
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            AI 코치 시작
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

type OptionButtonProps = {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
};

const OptionButton = ({
  label,
  description,
  selected,
  onClick,
}: OptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        selected
          ? 'border-orange-7 bg-orange-1'
          : 'border-line-line2 hover:bg-gray-1 bg-white'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
          selected
            ? 'border-orange-7 bg-orange-7 text-white'
            : 'border-line-line2 bg-white text-transparent'
        )}
      >
        <Target size={12} />
      </span>
      <span className="min-w-0">
        <span className="text-text-main block text-sm font-semibold">
          {label}
        </span>
        <span className="text-gray-8 mt-1 block text-xs leading-relaxed">
          {description}
        </span>
      </span>
    </button>
  );
};
