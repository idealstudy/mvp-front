import { cn } from '@/shared/lib';

type StudyroomStatus = 'OPEN' | 'OPERATING';

type StudyroomStatusToggleProps = {
  value: StudyroomStatus | null;
  onChange: (status: StudyroomStatus) => void;
};

const STATUS_LABELS: Record<StudyroomStatus, string> = {
  OPEN: '모집 중',
  OPERATING: '운영 중',
};

const STATUSES = Object.keys(STATUS_LABELS) as StudyroomStatus[];

export const StudyroomStatusToggle = ({
  value,
  onChange,
}: StudyroomStatusToggleProps) => {
  return (
    <div className="bg-gray-1 flex gap-2 rounded-lg p-2.5">
      {STATUSES.map((status) => {
        const isActive = value === status;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={cn(
              'flex-1 cursor-pointer rounded-lg p-2.5 transition-all',
              isActive
                ? 'font-body2-heading bg-white shadow-sm'
                : 'bg-gray-1 font-body2-normal'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
};
