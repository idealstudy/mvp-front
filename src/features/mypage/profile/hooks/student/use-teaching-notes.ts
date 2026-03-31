import { useState } from 'react';

import {
  ProfileTeachingNoteListSortKey,
  repository,
  studentKeys,
} from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 학생 마이페이지 수업노트 조회
 */
export const useStudentTeachingNotes = (options?: { enabled?: boolean }) => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sortKey, setSortKey] =
    useState<ProfileTeachingNoteListSortKey>('LATEST_EDITED');
  const [isExpanded, setIsExpanded] = useState(false);

  const params = {
    page: page - 1,
    size: 10,
    sortKey,
    keyword: keyword || undefined,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: studentKeys.mypage.teachingNote(params),
    queryFn: () => repository.mypage.getTeachingNoteList(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    keyword,
    setKeyword,
    sortKey,
    setSortKey,
    isExpanded,
    setIsExpanded,
  };
};
