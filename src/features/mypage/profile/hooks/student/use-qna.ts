import { useState } from 'react';

import {
  ProfileQnaListSortKey,
  ProfileQnaListStatus,
  repository,
  studentKeys,
} from '@/entities/student';
import { useQuery } from '@tanstack/react-query';

/**
 * [GET] 학생 마이페이지 질문 조회
 */
export const useStudentQna = (options?: { enabled?: boolean }) => {
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sort, setSort] = useState<ProfileQnaListSortKey>('LATEST');
  const [status, setStatus] = useState<ProfileQnaListStatus | undefined>(
    undefined
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const params = {
    page: page - 1,
    size: 10,
    searchKeyword: searchKeyword || undefined,
    sort,
    status,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: studentKeys.mypage.qna(params),
    queryFn: () => repository.mypage.getQnaList(params),
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
    searchKeyword,
    setSearchKeyword,
    sort,
    setSort,
    status,
    setStatus,
    isExpanded,
    setIsExpanded,
  };
};
