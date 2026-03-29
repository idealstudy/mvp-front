'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ColumnStatus, columnKeys } from '@/entities/column';
import DeleteColumnDialog from '@/features/community/column/components/delete-column-dialog';
import { useAdminApprovedColumnList } from '@/features/community/column/hooks/use-admin-column';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { MiniSpinner } from '@/shared/components/loading';
import { Button, Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { classifyColumnError, handleApiError } from '@/shared/lib/errors';
import { useQueryClient } from '@tanstack/react-query';

// TODO 현재는 게시 상태만 적용됨. 추후 반려/대기 상태 추가 예정
const STATUS_LABEL: Record<ColumnStatus, { label: string; className: string }> =
  {
    APPROVED: {
      label: '게시',
      className: 'bg-system-success-alt text-system-success',
    },
    PENDING_APPROVAL: {
      label: '대기',
      className: 'bg-system-warning-alt text-system-warning',
    },
  };

export default function AdminColumnTable() {
  const [page, setPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useAdminApprovedColumnList({ page: page - 1 });
  const deleteColumnMutation = useDeleteColumn();

  const columns = data?.content ?? [];

  // 삭제 후 빈 페이지 감지
  useEffect(() => {
    if (data && data.content.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [data, page]);

  if (isLoading) return <MiniSpinner />;

  return (
    <>
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-body1-heading">
            게시된 칼럼 목록 ({data?.totalElements ?? 0}건)
          </h2>
        </div>
        <div className="border-line-line2 overflow-hidden rounded-md border bg-white">
          <table className="w-full">
            <thead className="bg-gray-1 border-line-line2 border-b text-left">
              <tr className="*:px-5 *:py-4">
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>작성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody className="divide-line-line1 divide-y">
              {columns.map((column) => {
                const status = STATUS_LABEL[column.status];
                return (
                  <tr
                    key={column.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium">
                      <Link
                        href={`${PRIVATE.ADMIN.COLUMN.DETAIL(column.id)}?status=${column.status}`}
                        className="hover:underline"
                      >
                        {column.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {column.authorNickname ?? '알 수 없음'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-label-normal rounded-md px-2.5 py-1 ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {column.regDate.split('T')[0]}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="xsmall"
                          onClick={() => setDeleteTargetId(column.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          className="mt-6 justify-center"
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </section>
      {/* 삭제 확인 Dialog */}
      <DeleteColumnDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId)
            deleteColumnMutation.mutate(deleteTargetId, {
              onSuccess: () => {
                setDeleteTargetId(null);
              },
              onError: (error) => {
                handleApiError(error, classifyColumnError, {
                  // COLUMN_ARTICLE_NOT_EXIST
                  onContext: () => {
                    setDeleteTargetId(null);
                    queryClient.invalidateQueries({ queryKey: columnKeys.all });
                  },
                });
              },
            });
        }}
      />
    </>
  );
}
