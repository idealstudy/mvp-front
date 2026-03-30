'use client';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  HomeworkLimit,
  HomeworkPageable,
  HomeworkSortKey,
} from '@/entities/homework/types';
import { HomeworkSearchFilterBar } from '@/features/homework/components/search-filter-bar';
import { StudentHomeworkList } from '@/features/homework/components/student-homework-list';
import { TeacherHomeworkList } from '@/features/homework/components/teacher-homework-list';
import { useGetStudentHomeworkList } from '@/features/homework/hooks/student/useStudentHomeworkQuries';
import { useGetTeacherHomeworkList } from '@/features/homework/hooks/teacher/useTeacherHomeworkQuries';
import { StudyNoteGroupContext } from '@/features/study-notes/contexts/study-note-group.context';
import { StudyRoomDetailLayout } from '@/features/study-rooms/components/common/layout';
import { useRole } from '@/shared/hooks/use-role';

export default function HomeworkPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ctx = useContext(StudyNoteGroupContext);
  const selectedGroupId = ctx?.selectedGroupId ?? 'all';
  const prevSelectedGroupId = useRef<number | 'all'>(selectedGroupId);

  const currentPage = useMemo(() => {
    const raw = searchParams.get('page');
    const n = raw == null ? 1 : Number(raw);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }, [searchParams]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<HomeworkSortKey>('LATEST_EDITED');
  const [limit, setLimit] = useState<HomeworkLimit>(20);

  const { role } = useRole();
  const { id } = useParams();
  const studyRoomId = Number(id);

  const pageable: HomeworkPageable = {
    page: currentPage - 1,
    size: limit,
    sortKey: sort,
    keyword: search || undefined,
  };

  const teacherListQuery = useGetTeacherHomeworkList(studyRoomId, pageable);
  const studentListQuery = useGetStudentHomeworkList(studyRoomId, pageable);

  const activeQuery =
    role === 'ROLE_TEACHER' ? teacherListQuery : studentListQuery;
  const isPending = activeQuery.isPending;

  const homeworks =
    role === 'ROLE_TEACHER' ? teacherListQuery.data : studentListQuery.data;

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

  const replacePage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('page', String(page));
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, searchParams, router]
  );

  const handlePageChange = (page: number) => setPage(page);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1, { replace: true });
  };

  const handleSortChange = (value: HomeworkSortKey) => {
    setSort(value);
    setPage(1, { replace: true });
  };

  const handleLimitChange = (value: HomeworkLimit) => {
    setLimit(value);
    setPage(1, { replace: true });
  };

  useEffect(() => {
    if (prevSelectedGroupId.current !== selectedGroupId) {
      prevSelectedGroupId.current = selectedGroupId;
      replacePage(1);
    }
  }, [selectedGroupId, replacePage]);

  const page = {
    page: currentPage,
    totalPages: homeworks?.totalPages ?? 1,
    onPageChange: handlePageChange,
  };

  return (
    <StudyRoomDetailLayout
      filter={
        <HomeworkSearchFilterBar
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
      {role === 'ROLE_TEACHER' ? (
        <TeacherHomeworkList
          data={teacherListQuery.data?.content ?? []}
          studyRoomId={studyRoomId}
          pageable={pageable}
          keyword={search}
          onRefresh={teacherListQuery.refetch}
          isPending={isPending}
        />
      ) : (
        <StudentHomeworkList
          data={studentListQuery.data?.content ?? []}
          studyRoomId={studyRoomId}
          isPending={isPending}
        />
      )}
    </StudyRoomDetailLayout>
  );
}
