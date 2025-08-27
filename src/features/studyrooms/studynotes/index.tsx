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
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e: string) => {
    setSort(e as 'recent' | 'old' | 'alphabetical' | 'date');
  };

  const handleLimitChange = (e: number) => {
    setLimit(Number(e) as 20 | 30);
  };

  return (
    <div className="flex flex-col gap-6">
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
