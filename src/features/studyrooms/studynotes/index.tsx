'use client';

import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';

import { StudyNotesList } from './list';
import { SearchFilterBar } from './search-filter-bar';

export const StudyNotes = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'old' | 'alphabetical' | 'date'>(
    'recent'
  );
  const [limit, setLimit] = useState<20 | 30>(20);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page: number) => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    setSearch(value);
  };

  const handleSortChange = (e: string) => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    setSort(e as 'recent' | 'old' | 'alphabetical' | 'date');
  };

  const handleLimitChange = (e: number) => {
    // TODO: API 호출이나 상태 업데이트 로직 넣기
    setLimit(Number(e) as 20 | 30);
  };

  return (
    <div className="border-line-line1 flex flex-col gap-6 rounded-[12px] border bg-white px-8 py-6">
      <div className="flex flex-col gap-3">
        <SearchFilterBar
          search={search}
          sort={sort}
          limit={limit}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onLimitChange={handleLimitChange}
        />
        <StudyNotesList />
      </div>
      <Pagination
        page={currentPage}
        totalPages={2}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
