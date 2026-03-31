import { useState } from 'react';

import {
  ProfileHomeworkListSortKey,
  repository,
  studentKeys,
} from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 학생 마이페이지 과제 조회
 */
export const useStudentHomeworks = (options?: { enabled?: boolean }) => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sortKey, setSortKey] =
    useState<ProfileHomeworkListSortKey>('DEADLINE_IMMINENT');
  const [isExpanded, setIsExpanded] = useState(false);

  const params = { page: page - 1, size: 10, keyword, sortKey };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: studentKeys.mypage.homework(params),
    queryFn: () => repository.mypage.getHomeworkList(params),
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
