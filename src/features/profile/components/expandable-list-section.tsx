'use client';

import { Pagination, SearchInput, Select } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

interface SortOption {
  label: string;
  value: string;
}

interface ExpandableListSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  keyword: string;
  onSearch: (value: string) => void;
  sortKey: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

export default function ExpandableListSection({
  isExpanded,
  onToggle,
  keyword,
  onSearch,
  sortKey,
  onSortChange,
  sortOptions,
  page,
  totalPages,
  onPageChange,
  children,
}: ExpandableListSectionProps) {
  return (
    <>
      {isExpanded && (
        <div
          className={cn(
            'mb-2 flex flex-col gap-2',
            'tablet:flex-row tablet:items-center tablet:justify-between'
          )}
        >
          <Select
            value={sortKey}
            onValueChange={onSortChange}
          >
            <Select.Trigger
              className="font-label-normal h-9 w-auto min-w-[130px] rounded-lg pr-10 pl-3"
              placeholder="정렬"
            />
            <Select.Content>
              {sortOptions.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  className="font-body2-normal h-8 justify-center px-4"
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
          <SearchInput
            defaultValue={keyword}
            placeholder="검색어를 입력하세요"
            onSearch={onSearch}
            className={cn('w-full', 'tablet:w-auto')}
          />
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        {children}

        {/* 페이지네이션 */}
        {isExpanded && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}

        <button
          onClick={onToggle}
          className="font-label-normal hover:bg-gray-1 w-full cursor-pointer rounded-md py-2 text-center"
        >
          {isExpanded ? '접기' : '전체 보기'}
        </button>
      </div>
    </>
  );
}
