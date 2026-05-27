'use client';

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
    <div className="grid grid-cols-2 gap-3">
      {choices.map((choice, idx) => {
        const isSelected = selected === choice;
        return (
          <button
            key={idx}
            onClick={() => onSelect(choice)}
            className={cn(
              'flex items-center justify-center gap-3 rounded-xl border-2 px-4 py-5 text-sm font-medium transition-colors',
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
