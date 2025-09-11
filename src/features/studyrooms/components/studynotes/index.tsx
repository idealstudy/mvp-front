'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import {
  useStudyNotesByGroupIdQuery,
  useStudyNotesQuery,
} from '@/features/studynotes/services/query';

import { StudyRoomDetailLayout } from '../common/layout';
import { StudyNotesList } from './list';
import type {
  StudyNoteGroupPageable,
  StudyNoteLimit,
  StudyNoteSortKey,
} from './type';

export const StudyNotes = ({
  selectedGroupId,
}: {
  selectedGroupId: number | 'all';
}) => {
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

  // TODO: 수업노트 조회 API keyword search 연결
  const { data } = useStudyNotesQuery({
    studyRoomId: studyRoomId,
    pageable: pageable,
    // keyword: search,
  });

  // TODO: 수업노트 그룹으로 수업노트 조회 API keyword search 연결
  const { data: studyNotesByGroupId } = useStudyNotesByGroupIdQuery({
    studyRoomId: studyRoomId,
    teachingNoteGroupId: Number(selectedGroupId),
    pageable: pageable,
    // keyword: search,
    enabled: selectedGroupId !== 'all',
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

  const page = {
    page: currentPage,
    totalPages:
      selectedGroupId === 'all'
        ? data?.totalPages || 1
        : studyNotesByGroupId?.data?.totalPages || 1,
    onPageChange: handlePageChange,
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [search, sort, limit, selectedGroupId]);

  return (
    <StudyRoomDetailLayout
      search={search}
      sort={sort}
      limit={limit}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      onLimitChange={handleLimitChange}
      page={page}
    >
      <StudyNotesList
        data={
          selectedGroupId === 'all'
            ? data?.content || []
            : studyNotesByGroupId?.data?.content || []
        }
        studyRoomId={Number(studyRoomId)}
        pageable={pageable}
        keyword={search}
      />
    </StudyRoomDetailLayout>
  );
};
