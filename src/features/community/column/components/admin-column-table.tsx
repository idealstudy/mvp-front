'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ColumnStatus } from '@/entities/column';
import DeleteColumnDialog from '@/features/community/column/components/delete-column-dialog';
import {
  useAdminApprovedColumnList,
  useApproveColumn,
} from '@/features/community/column/hooks/use-admin-column';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { Button, Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';

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

  const { data } = useAdminApprovedColumnList({ page: page - 1 });
  const approveColumnMutation = useApproveColumn();
  const deleteColumnMutation = useDeleteColumn();

  const columns = data?.content ?? [];

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
                        {column.status === 'PENDING_APPROVAL' && (
                          <Button
                            size="xsmall"
                            onClick={() =>
                              approveColumnMutation.mutate(column.id)
                            }
                          >
                            승인
                          </Button>
                        )}

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
      {/* 모달 */}
      <DeleteColumnDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() =>
          deleteTargetId && deleteColumnMutation.mutate(deleteTargetId)
        }
      />
    </>
  );
}
