import { columnKeys, repository } from '@/entities/column';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * [GET] 승인된 칼럼 목록 조회 (관리자)
 */
export const useAdminApprovedColumnList = (params: { page: number }) =>
  useQuery({
    queryKey: columnKeys.adminList({ ...params, size: 10, status: 'APPROVED' }),
    queryFn: () =>
      repository.getAdminColumnList({
        ...params,
        size: 10,
        status: 'APPROVED',
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

/**
 * [GET] 승인 대기 중인 칼럼 목록 조회 (관리자)
 */
export const useAdminPendingColumnList = (params: { page: number }) =>
  useQuery({
    queryKey: columnKeys.adminList({
      ...params,
      size: 5,
      status: 'PENDING_APPROVAL',
    }),
    queryFn: () =>
      repository.getAdminColumnList({
        ...params,
        size: 5,
        status: 'PENDING_APPROVAL',
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

/**
 * [GET] 칼럼 상세 조회 (관리자)
 */
export const useAdminColumnDetail = (
  id: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: columnKeys.adminDetail(id),
    queryFn: () => repository.getAdminColumnDetail(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

/**
 * [PATCH] 칼럼 승인 (관리자)
 */
export const useApproveColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => repository.approveColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
    },
  });
};
