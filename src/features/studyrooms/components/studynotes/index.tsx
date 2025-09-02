'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { Pagination } from '@/components/ui/pagination';

import { StudyNotesList } from './list';
import { SearchFilterBar } from './search-filter-bar';
import { useStudyNotesQuery } from './services/query';
import type {
  StudyNoteGroupPageable,
  StudyNoteLimit,
  StudyNoteSortKey,
} from './type';

export const StudyNotes = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<StudyNoteSortKey>('LATEST_EDITED');
  const [limit, setLimit] = useState<StudyNoteLimit>(20);
  const [currentPage, setCurrentPage] = useState(0);
  const { id } = useParams();
  const studyRoomId = Number(id);

  const pageable: StudyNoteGroupPageable = {
    page: currentPage,
    size: limit,
    sortKey: sort,
  };

  const { data } = useStudyNotesQuery({
    studyRoomId: studyRoomId,
    pageable: pageable,
    keyword: search,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSortChange = (e: string) => {
    setSort(e as StudyNoteSortKey);
  };

  const handleLimitChange = (e: number) => {
    setLimit(Number(e) as StudyNoteLimit);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [search, sort, limit]);

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
        <StudyNotesList
          data={data?.content || []}
          studyRoomId={Number(studyRoomId)}
          pageable={pageable}
          keyword={search}
        />
      </div>
      <Pagination
        page={currentPage}
        totalPages={data?.totalPages || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
