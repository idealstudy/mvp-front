import { cn } from '@/shared/lib';

type ChoiceListProps = {
  choices: string[];
  selected: string | null;
  onSelect: (choice: string) => void;
};

export const ChoiceList = ({
  choices,
  selected,
  onSelect,
}: ChoiceListProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {choices.map((choice, idx) => {
        const isSelected = selected === choice;
        return (
          <button
            type="button"
            key={idx}
            onClick={() => onSelect(choice)}
            className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-sm font-medium transition-colors md:flex-col md:py-5',
              isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-line-line1 text-text-main hover:border-line-line2 hover:bg-gray-1 bg-white'
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                isSelected ? 'bg-blue-500 text-white' : 'bg-gray-1 text-gray-8'
              )}
            >
              {idx + 1}
            </span>
            <span>{choice}</span>
          </button>
        );
      })}
    </div>
  );
};
