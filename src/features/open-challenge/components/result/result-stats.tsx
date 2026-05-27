import { cn } from '@/shared/lib';
import { BarChart2, Check, Flame, X } from 'lucide-react';

type ResultStatsProps = {
  isCorrect: boolean;
  correctAnswer: string;
  passRate: number;
  participantCount: number;
};

export const ResultStats = ({
  isCorrect,
  correctAnswer,
  passRate,
  participantCount,
}: ResultStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isCorrect
              ? 'bg-system-success-alt text-system-success'
              : 'bg-system-warning-alt text-system-warning'
          )}
        >
          {isCorrect ? <Check size={20} /> : <X size={20} />}
        </div>
        <div>
          <p className="text-gray-8 text-xs">정답</p>
          <p
            className={cn(
              'mt-1 text-3xl font-bold',
              isCorrect ? 'text-system-success' : 'text-system-warning'
            )}
          >
            {correctAnswer}
          </p>
        </div>
        <p className="text-gray-8 text-xs">
          {isCorrect ? '정답을 맞혔어요! 🎉' : '다음엔 맞힐 수 있어요!'}
        </p>
      </div>

      <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center">
        <Flame
          size={24}
          className="text-orange-7"
        />
        <div>
          <p className="text-gray-8 text-xs">통과율</p>
          <p className="text-orange-7 mt-1 text-3xl font-bold">{passRate}%</p>
        </div>
        <p className="text-gray-8 text-xs">
          10명 중 {Math.round((passRate / 100) * 10)}명이 맞혔어요
        </p>
      </div>

      <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center">
        <BarChart2
          size={24}
          className="text-gray-7"
        />
        <div>
          <p className="text-gray-8 text-xs">참여자</p>
          <p className="text-text-main mt-1 text-3xl font-bold">
            {participantCount}명
          </p>
        </div>
        <p className="text-gray-8 text-xs">이 문제에 도전한 인원이에요</p>
      </div>
    </div>
  );
};
