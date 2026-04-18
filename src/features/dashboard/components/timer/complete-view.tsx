import { Button } from '@/shared/components/ui/button';
import { Check } from 'lucide-react';

import { formatHHMMSS } from './constants';

export type CompleteViewProps = {
  elapsed: number;
  subjectLabel: string | null;
  topic: string;
  dateStr: string;
  onClose: () => void;
  onWriteNote: () => void;
};

export const CompleteView = ({
  elapsed,
  subjectLabel,
  topic,
  dateStr,
  onClose,
  onWriteNote,
}: CompleteViewProps) => (
  <div className="flex flex-col items-center gap-6">
    <div className="bg-key-color-primary flex size-16 items-center justify-center rounded-full">
      <Check
        size={32}
        strokeWidth={3}
        className="text-white"
      />
    </div>

    <div className="flex flex-col items-center gap-1">
      <p className="font-headline1-heading">
        {formatHHMMSS(elapsed)} 공부 완료
      </p>
      <p className="text-text-sub font-body2-normal">
        오늘도 공부했다니 정말 멋져요!
      </p>
    </div>

    <div className="bg-gray-1 flex w-full items-center gap-3 rounded-lg px-4 py-3">
      <span className="text-text-sub font-body2-normal">{dateStr}</span>
      <div className="bg-line-line2 h-4 w-px" />
      <span className="text-text-main font-body2-normal">
        {subjectLabel ? `${subjectLabel} ` : ''}
        {topic}
      </span>
    </div>

    <div className="flex w-full gap-3">
      <Button
        variant="secondary"
        className="flex-1"
        onClick={onClose}
      >
        종료
      </Button>
      <Button
        className="flex-1"
        onClick={onWriteNote}
      >
        이어서 학습노트 작성
      </Button>
    </div>
  </div>
);
