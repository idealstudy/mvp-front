'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

type Props = {
  search: string;
  sort: string;
  limit: number;
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onLimitChange: (value: number) => void;
};

const SORT_OPTIONS = [
  { value: 'recent', label: '최근 편집순' },
  { value: 'old', label: '오래된순' },
  { value: 'alphabetical', label: '가나다순' },
  { value: 'date', label: '수업일자순' },
];

const LIMIT_OPTIONS = [
  { value: '20', label: '20개씩' },
  { value: '30', label: '30개씩' },
];

const SELECT_STYLES = {
  trigger:
    'border-line-line3 bg-gray-scale-white relative flex h-[36px] items-center justify-between rounded-[8px] border pr-11 pl-3 text-start text-sm outline-hidden min-w-[110px] data-placeholder:text-text-sub2 placeholder-text-text-sub2',
  content:
    'w-[110px] border-line-line2 text-main bg-gray-scale-white relative z-50 max-w-[calc(100vw-12px)] overflow-hidden rounded-[6px] border',
  option:
    'relative flex h-[32px] cursor-pointer items-center justify-center px-3 outline-hidden select-none',
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
          <Select.Content className={SELECT_STYLES.content}>
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
          <Select.Content className="w-[110px]">
            {LIMIT_OPTIONS.map((option) => (
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
      </div>
      <div className="relative">
        <Input
          className="desktop:max-w-[234px] border-line-line1 h-12 w-full pr-12"
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
