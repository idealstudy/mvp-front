import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useSubjectList } from '@/shared/hooks';
import { cn } from '@/shared/lib';
import { X } from 'lucide-react';

export type SetupViewProps = {
  topic: string;
  onTopicChange: (v: string) => void;
  selectedSubject: string | null;
  onSubjectChange: (v: string | null) => void;
  canStart: boolean;
  onStart: () => void;
  onClose: () => void;
};

export const SetupView = ({
  topic,
  onTopicChange,
  selectedSubject,
  onSubjectChange,
  canStart,
  onStart,
  onClose,
}: SetupViewProps) => {
  const { data: subjects = [] } = useSubjectList();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline1-heading">타이머</h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-body1-heading">오늘의 공부 주제를 입력해 주세요.</p>
        <Input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="공부 주제를 작성해주세요"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-body1-heading">공부할 과목을 선택해주세요.</p>
        <div className="flex flex-wrap gap-2">
          {subjects.map(({ code, name }) => (
            <button
              key={code}
              type="button"
              onClick={() =>
                onSubjectChange(selectedSubject === code ? null : code)
              }
              className={cn(
                'font-body2-normal rounded-full border px-6 py-2.5 transition-colors',
                selectedSubject === code
                  ? 'border-key-color-primary bg-orange-1 text-key-color-primary'
                  : 'border-line-line2 text-text-sub hover:border-key-color-primary'
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!canStart}
          onClick={onStart}
          className="px-10"
        >
          타이머 시작
        </Button>
      </div>
    </div>
  );
};
