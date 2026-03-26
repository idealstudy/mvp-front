import { ColumnSortOption, ColumnStatus } from '@/entities/column/types';

export const columnKeys = {
  all: ['column'] as const,
  list: (params: { page: number; size: number; sort: ColumnSortOption }) =>
    [...columnKeys.all, 'list', params] as const,
  detail: (id: number) => [...columnKeys.all, 'detail', id] as const,
  myList: (params: { page: number; size: number; status?: ColumnStatus }) =>
    [...columnKeys.all, 'my-list', params] as const,
  myDetail: (id: number) => [...columnKeys.all, 'my-detail', id] as const,
  adminList: (params: { page: number; size: number; status?: ColumnStatus }) =>
    [...columnKeys.all, 'admin-list', params] as const,
};
