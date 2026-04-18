import { TextEditor } from '@/shared/components/editor';
import type { TextEditorValue } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { ChevronDown, ChevronUp, Pause, Play, X } from 'lucide-react';

import { formatHHMMSS } from './constants';

export type RunningViewProps = {
  elapsed: number;
  isRunning: boolean;
  subjectLabel: string | null;
  noteOpen: boolean;
  noteContent: TextEditorValue;
  onNoteContentChange: (v: TextEditorValue) => void;
  onToggleNote: () => void;
  onPauseResume: () => void;
  onTempSave: () => void;
  onReset: () => void;
  onFinish: () => void;
  onClose: () => void;
};

export const RunningView = ({
  elapsed,
  isRunning,
  subjectLabel,
  noteOpen,
  noteContent,
  onNoteContentChange,
  onToggleNote,
  onPauseResume,
  onTempSave,
  onReset,
  onFinish,
  onClose,
}: RunningViewProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer"
      >
        <X size={22} />
      </button>
    </div>

    <div className="flex flex-col items-center gap-2">
      <p className="text-[56px] leading-none font-bold tracking-tight">
        {formatHHMMSS(elapsed)}
      </p>
      <p className="text-text-sub font-body2-normal">
        {subjectLabel ? `${subjectLabel} 공부 중...` : '공부 중...'}
      </p>
    </div>

    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onReset}
        className="border-line-line2 text-text-main font-body2-heading hover:bg-gray-1 rounded-full border px-6 py-2.5"
      >
        다시 시작
      </button>
      <button
        type="button"
        onClick={onPauseResume}
        className="bg-key-color-primary hover:bg-orange-scale-orange-60 flex size-12 items-center justify-center rounded-full transition-colors"
      >
        {isRunning ? (
          <Pause
            size={20}
            fill="white"
            className="text-white"
          />
        ) : (
          <Play
            size={20}
            fill="white"
            className="text-white"
          />
        )}
      </button>
      <button
        type="button"
        onClick={onFinish}
        className="border-key-color-primary text-key-color-primary font-body2-heading hover:bg-orange-1 rounded-full border px-6 py-2.5"
      >
        종료하기
      </button>
    </div>

    <div className="border-line-line1 rounded-lg border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-headline2-heading">학습노트</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="xsmall"
            onClick={onTempSave}
          >
            임시저장
          </Button>
          <button
            type="button"
            onClick={onToggleNote}
            className="text-text-sub hover:text-text-main cursor-pointer"
          >
            {noteOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      {noteOpen && (
        <div className="px-4 pb-4">
          <TextEditor
            value={noteContent}
            onChange={onNoteContentChange}
            placeholder="생각나는 내용을 자유롭게 기록해보세요"
            minHeight="200px"
            maxHeight="320px"
          />
        </div>
      )}
    </div>
  </div>
);
