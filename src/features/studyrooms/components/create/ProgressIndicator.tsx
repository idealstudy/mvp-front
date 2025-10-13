import { ORDER } from '@/features/studyrooms/components/create/CreateStudyRoomFlow';

export default function ProgressIndicator({
  current,
  max,
  onMove,
}: {
  current: number;
  max: number;
  onMove: (to: number) => void;
}) {
  return (
    <nav aria-label="진행 단계">
      <ol className="flex items-center gap-6">
        {ORDER.map((_, index) => {
          const state =
            index < current
              ? 'completed'
              : index === current
                ? 'current'
                : 'upcoming';
          return (
            <li
              key={index}
              className="flex items-center"
            >
              <button
                type="button"
                aria-current={state === 'current' ? 'step' : undefined}
                disabled={index > max}
                onClick={() => onMove(index)}
                className="data-[state=completed]:bg-key-color-primary data-[state=current]:bg-key-color-primary block h-2 w-24 cursor-pointer rounded-full data-[state=upcoming]:cursor-not-allowed data-[state=upcoming]:bg-gray-300"
                data-state={state}
              >
                <span className="sr-only">{index + 1}단계</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
