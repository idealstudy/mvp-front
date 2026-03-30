'use client';

import { useEffect, useState } from 'react';

import { Pagination } from '@/shared/components/ui/pagination';
import { useRole } from '@/shared/hooks/use-role';
import { Pageable } from '@/types/http';

import { useQnAsQuery } from '../../services/query';
import { QnAFilter, SortKey } from '../../types';
import QuestionList from './qna-list';
import { SearchFilterBar } from './search-filter-bar';

type Props = {
  studyRoomId: number;
  hasBorder?: boolean;
};

const QuestionListWrapper = ({ studyRoomId, hasBorder }: Props) => {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<QnAFilter>('DEFAULT');
  const [sort, setSort] = useState<SortKey>('LATEST');
  const [currentPage, setCurrentPage] = useState(1);

  const pageable: Pageable = {
    page: currentPage - 1,
    size: 20,
    sort: [],
  };

  const { data: qnaList, isPending } = useQnAsQuery(role, {
    studyRoomId,
    pageable,
    status: filter === 'DEFAULT' ? undefined : filter,
    sort,
    searchKeyword: search.trim() || undefined,
  });

  const handleFilterChange = (e: string) => {
    setFilter(e as QnAFilter);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSortChange = (e: string) => {
    setSort(e as SortKey);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const page = {
    page: currentPage,
    totalPages: qnaList?.totalPages || 1,
    onPageChange: handlePageChange,
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, filter]);

  return (
    <div
      className={
        hasBorder
          ? 'border-line-line1 flex flex-col gap-6 rounded-[12px] border bg-white p-6 px-8'
          : ''
      }
    >
      <div className="flex flex-col items-center gap-6 rounded-[12px]">
        <div className="flex w-full flex-col gap-3">
          <SearchFilterBar
            search={search}
            filter={filter}
            sort={sort}
            onSearch={handleSearch}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
          <QuestionList
            studyRoomId={studyRoomId}
            data={qnaList?.content || []}
            isPending={isPending}
          />
        </div>
        <Pagination {...page} />
      </div>
    </div>
  );
};

export default QuestionListWrapper;
