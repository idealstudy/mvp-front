import { useRouter } from 'next/navigation';

import {
  CreateColumnArticlePayload,
  UpdateColumnArticlePayload,
  columnKeys,
  repository,
} from '@/entities/column';
import { PUBLIC } from '@/shared/constants';
import { useMemberStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * [POST] 칼럼 생성
 */
export const useCreateColumn = () => {
  const role = useMemberStore((state) => state.member?.role);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateColumnArticlePayload) => {
      if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
        throw new Error('권한이 없습니다.');
      }
      return repository.createColumn(params, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      router.replace(PUBLIC.COMMUNITY.COLUMN.LIST);
    },
  });
};

/**
 * [PUT] 칼럼 수정
 */
export const useUpdateColumn = (id: number) => {
  const role = useMemberStore((state) => state.member?.role);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: UpdateColumnArticlePayload) => {
      if (role !== 'ROLE_TEACHER' && role !== 'ROLE_ADMIN') {
        throw new Error('권한이 없습니다.');
      }
      return repository.updateColumn(id, params, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      router.replace(PUBLIC.COMMUNITY.COLUMN.DETAIL(id));
    },
  });
};

/**
 * [DELETE] 칼럼 삭제
 * TODO 관리자 삭제 추가
 */
export const useDeleteColumn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => repository.deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: columnKeys.all });
      router.replace(PUBLIC.COMMUNITY.COLUMN.LIST);
    },
  });
};
