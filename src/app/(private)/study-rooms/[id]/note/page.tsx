'use client';

// 상태관리 zustand로
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { StudyNotesList } from '@/features/study-notes/components/list';
import { StudyNoteSearchFilterBar } from '@/features/study-notes/components/search-filter-bar';
import { StudyNoteGroupContext } from '@/features/study-notes/contexts/study-note-group.context';
import {
  useGetStudentNotesByGroup,
  useGetStudentNotesList,
  useGetTeacherNotesByGroup,
  useGetTeacherNotesList,
} from '@/features/study-notes/hooks';
import {
  StudyNoteGroupPageable,
  StudyNoteLimit,
  StudyNoteSortKey,
} from '@/features/study-notes/model';
import { StudyRoomDetailLayout } from '@/features/study-rooms/components/common/layout';
import { MiniSpinner } from '@/shared/components/loading';
import { useRole } from '@/shared/hooks/use-role';

export default function StudyNotePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ctx = useContext(StudyNoteGroupContext);
  const selectedGroupId = ctx?.selectedGroupId ?? 'all';

  const currentPage = useMemo(() => {
    const raw = searchParams.get('page');
    const n = raw == null ? 0 : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [searchParams]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<StudyNoteSortKey>('LATEST_EDITED');
  const [limit, setLimit] = useState<StudyNoteLimit>(20);

  const { role } = useRole();
  const { id } = useParams();
  const studyRoomId = Number(id);

  const pageable: StudyNoteGroupPageable = {
    page: currentPage,
    size: limit,
    sortKey: sort,
  };

  // ------------------------------------------------------------------
  // 일반 목록 조회
  // TODO: 추후 엔티티분리후 커스텀훅으로 분리
  // ------------------------------------------------------------------
  const teacherListQuery = useGetTeacherNotesList({
    studyRoomId,
    pageable,
    keyword: search,
    enabled: role === 'ROLE_TEACHER',
  });

  const studentListQuery = useGetStudentNotesList({
    studyRoomId,
    pageable,
    keyword: search,
    enabled: role === 'ROLE_STUDENT',
  });

  // ------------------------------------------------------------------
  // 그룹별 목록 조회
  // TODO: 추후 엔티티분리
  // ------------------------------------------------------------------
  const isGroupSelected = selectedGroupId !== 'all';
  const teachingNoteGroupId = Number(selectedGroupId);

  const teacherByGroupQuery = useGetTeacherNotesByGroup({
    studyRoomId,
    teachingNoteGroupId,
    pageable,
    keyword: search,
    enabled: isGroupSelected && role === 'ROLE_TEACHER',
  });

  const studentByGroupQuery = useGetStudentNotesByGroup({
    studyRoomId,
    teachingNoteGroupId,
    pageable,
    keyword: search,
    enabled: isGroupSelected && role === 'ROLE_STUDENT',
  });

  // 현재 선택된 query 결정
  const currentQuery =
    selectedGroupId === 'all'
      ? role === 'ROLE_TEACHER'
        ? teacherListQuery
        : studentListQuery
      : role === 'ROLE_TEACHER'
        ? teacherByGroupQuery
        : studentByGroupQuery;

  const setPage = useCallback(
    (page: number, { replace = false }: { replace?: boolean } = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('page', String(page));

      const href = `${pathname}?${next.toString()}`;
      if (replace) router.replace(href);
      else router.push(href);
    },
    [pathname, searchParams, router]
  );

  const handlePageChange = (page: number) => setPage(page);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0, { replace: true }); // 히스토리 누적 방지
  };

  const handleSortChange = (value: StudyNoteSortKey) => {
    setSort(value);
    setPage(0, { replace: true });
  };

  const handleLimitChange = (value: StudyNoteLimit) => {
    setLimit(value);
    setPage(0, { replace: true });
  };

  // Todo: 재설계 예정 -> 그룹 변경 시 page=0 (URL만 수정)
  useEffect(() => {
    setPage(0, { replace: true });
  }, [selectedGroupId, setPage]);

  const page = {
    page: currentPage,
    totalPages: currentQuery.data?.totalPages ?? 1,
    onPageChange: handlePageChange,
  };

  if (!role) {
    return <MiniSpinner />;
  }

  return (
    <StudyRoomDetailLayout
      filter={
        <StudyNoteSearchFilterBar
          search={search}
          sort={sort}
          limit={limit}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onLimitChange={handleLimitChange}
        />
      }
      page={page}
    >
      <StudyNotesList
        data={currentQuery.data?.content ?? []}
        isPending={currentQuery.isPending}
        isError={currentQuery.isError}
        studyRoomId={studyRoomId}
        pageable={pageable}
        keyword={search}
        onRefresh={currentQuery.refetch}
        canManage={role === 'ROLE_TEACHER'}
      />
    </StudyRoomDetailLayout>
  );
}
