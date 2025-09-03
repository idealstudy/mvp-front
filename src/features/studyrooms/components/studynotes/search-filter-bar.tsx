'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import type { StudyNoteLimit, StudyNoteSortKey } from './type';

type Props = {
  search: string;
  sort: string;
  limit: number;
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onLimitChange: (value: number) => void;
};

const SORT_OPTIONS: Array<{ value: StudyNoteSortKey; label: string }> = [
  { value: 'LATEST_EDITED', label: '최근 편집순' },
  { value: 'OLDEST_EDITED', label: '오래된순' },
  { value: 'TITLE_ASC', label: '가나다순' },
  { value: 'TAUGHT_AT_ASC', label: '수업일자순' },
];

const LIMIT_OPTIONS: Array<{ value: StudyNoteLimit; label: string }> = [
  { value: 20, label: '20개씩' },
  { value: 30, label: '30개씩' },
];

const SELECT_STYLES = {
  trigger:
    'border-line-line2 h-[36px] rounded-[8px] pr-8 pl-2 text-sm min-w-[110px] text-[var(--color-text-sub2)] whitespace-nowrap data-[state=open]:border-line-line3 focus:ring-0 focus:outline-none px-3 font-label-normal',
  option:
    'flex h-[32px] border-b-0 text-center w-full font-body2-normal justify-center items-center',
};

export const SearchFilterBar = ({
  search,
  sort,
  limit,
  onSearch,
  onSortChange,
  onLimitChange,
}: Props) => {
  const [localSearch, setLocalSearch] = useState(search);

  return (
    <div className="items-cente flex justify-between gap-4">
      <div className="flex gap-[10px]">
        <Select
          defaultValue={sort}
          onValueChange={onSortChange}
        >
          <Select.Trigger
            className={SELECT_STYLES.trigger}
            placeholder="최근 편집순"
            data-position="right-2"
          />
          <Select.Content>
            {SORT_OPTIONS.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value}
                className={SELECT_STYLES.option}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
        <Select
          defaultValue={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <Select.Trigger
            className={SELECT_STYLES.trigger}
            placeholder="20개씩"
            data-position="right-2"
          />
          <Select.Content>
            {LIMIT_OPTIONS.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value.toString()}
                className={SELECT_STYLES.option}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div className="relative w-[234px]">
        <Input
          className="border-line-line1 font-body2-normal h-12 w-full rounded-[8px] pr-[42px] pl-4"
          placeholder="검색어를 입력하세요"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearch(e.currentTarget.value);
            }
          }}
        />
        <Image
          src="/studynotes/search.png"
          alt="search"
          width={18}
          height={20}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>
    </div>
  );
};
