'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Select } from '@/features/study-rooms/components/common/select';
import { Input } from '@/shared/components/ui/input';

import { LimitNumber, QnAFilter, SortKey } from '../../types';

type Props = {
  search: string;
  sort?: SortKey;
  limit?: LimitNumber;
  filter?: QnAFilter;
  onSearch: (value: string) => void;
  onSortChange?: (value: SortKey) => void;
  onLimitChange?: (value: LimitNumber) => void;
  onFilterChange?: (value: QnAFilter) => void;
};

// TODO: sort 타입 임시로 캐스팅 추후 바꿀 예정(노트랑 중복)
// TODO: src/app/(private)/study-rooms/[id]/(study-note)/note/page.tsx
// TODO: 중복 변수있음 삭제할꺼임
const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'LATEST', label: '최신순' },
  { value: 'OLDEST', label: '오래된순' },
  { value: 'ALPHABETICAL', label: '가나다순' },
];

const LIMIT_OPTIONS: Array<{ value: LimitNumber; label: string }> = [
  { value: 20, label: '20개씩' },
  { value: 30, label: '30개씩' },
];

const QUESTION_FILTER_OPTIONS: Array<{ value: QnAFilter; label: string }> = [
  { value: 'DEFAULT', label: '모두보기' },
  { value: 'PENDING', label: '피드백 대기만' },
  { value: 'COMPLETED', label: '피드백 완료만' },
];

const SELECT_STYLES = {
  trigger:
    'border-line-line2 h-[36px] rounded-[8px] pr-8 pl-2 text-sm w-auto min-w-[110px] text-[var(--color-text-sub2)] whitespace-nowrap mock-[state=open]:border-line-line3 focus:ring-0 focus:outline-none px-3 font-label-normal',
  option:
    'flex h-[32px] border-b-0 text-center w-full font-body2-normal justify-center items-center',
};

export const SearchFilterBar = ({
  search,
  sort,
  limit,
  filter,
  onSearch,
  onSortChange,
  onLimitChange,
  onFilterChange,
}: Props) => {
  const [localSearch, setLocalSearch] = useState(search);

  return (
    <div className="items-cente flex justify-between gap-4">
      <div className="flex gap-[10px]">
        {/* 질문 필터 */}
        {filter && onFilterChange && (
          <Select
            value={filter}
            onValueChange={onFilterChange}
          >
            <Select.Trigger
              className={SELECT_STYLES.trigger}
              placeholder="모두보기"
              data-position="right-2"
            />
            <Select.Content>
              {QUESTION_FILTER_OPTIONS.map((option) => (
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
        )}
        {/* 최근 편집순 */}
        {sort && onSortChange && (
          <Select
            value={sort}
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
        )}
        {/* 개수 표시 */}
        {limit && onLimitChange && (
          <Select
            value={limit.toString()}
            onValueChange={(value) =>
              onLimitChange(Number(value) as LimitNumber)
            }
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
        )}
      </div>
      {/* 검색창 */}
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
