'use client';

import { Select } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

export type SubjectFilter = 'ALL' | 'MATH' | 'KOREAN' | 'ENGLISH' | 'SCIENCE';
export type SortOption = 'latest' | 'popular';

const SUBJECTS: { value: SubjectFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'MATH', label: '수학' },
  { value: 'KOREAN', label: '국어' },
  { value: 'ENGLISH', label: '영어' },
  { value: 'SCIENCE', label: '탐구' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

type SubjectFilterBarProps = {
  subject: SubjectFilter;
  sort: SortOption;
  onSubjectChange: (subject: SubjectFilter) => void;
  onSortChange: (sort: SortOption) => void;
};

export const SubjectFilterBar = ({
  subject,
  sort,
  onSubjectChange,
  onSortChange,
}: SubjectFilterBarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {SUBJECTS.map((subjectOption) => (
          <button
            key={subjectOption.value}
            onClick={() => onSubjectChange(subjectOption.value)}
            className={cn(
              'cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors',
              subject === subjectOption.value
                ? 'bg-orange-7 text-white'
                : 'border-line-line2 text-text-main hover:bg-gray-1 border bg-white'
            )}
          >
            {subjectOption.label}
          </button>
        ))}
      </div>

      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <Select.Trigger
          className="border-line-line2 font-label-normal h-[36px] w-auto min-w-[90px] rounded-[8px] px-3 pr-8 text-sm whitespace-nowrap focus:ring-0 focus:outline-none"
          placeholder="최신순"
        />
        <Select.Content>
          {SORT_OPTIONS.map((sortOption) => (
            <Select.Option
              key={sortOption.value}
              value={sortOption.value}
              className="font-body2-normal flex h-[32px] w-full items-center justify-center border-b-0 text-center"
            >
              {sortOption.label}
            </Select.Option>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
