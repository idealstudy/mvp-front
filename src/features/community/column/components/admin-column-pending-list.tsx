'use client';

import { useState } from 'react';

import Link from 'next/link';

import DeleteColumnDialog from '@/features/community/column/components/delete-column-dialog';
import {
  useAdminPendingColumnList,
  useApproveColumn,
} from '@/features/community/column/hooks/use-admin-column';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { Button, Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';

export default function AdminColumnPendingList() {
  const [page, setPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data } = useAdminPendingColumnList({ page: page - 1 });
  const approveColumnMutation = useApproveColumn();
  const deleteColumnMutation = useDeleteColumn();

  const columns = data?.content ?? [];

  if (!data || data.totalElements === 0) return null;

  return (
    <>
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-body1-heading">
            승인 대기 중인 칼럼 ({data?.totalElements ?? 0}건)
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="border-line-line2 flex items-center justify-between rounded-lg border bg-white px-6 py-4"
            >
              <div>
                <p className="font-body2-heading hover:underline">
                  <Link
                    href={`${PRIVATE.ADMIN.COLUMN.DETAIL(column.id)}?status=${column.status}`}
                  >
                    {column.title}
                  </Link>
                </p>
                <div className="text-gray-10 font-caption-normal mt-2 flex items-center gap-3">
                  <span>{column.authorNickname} 선생님</span>
                  <span>{column.regDate.split('T')[0]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="xsmall"
                  asChild
                >
                  <Link
                    href={`${PRIVATE.ADMIN.COLUMN.DETAIL(column.id)}?status=${column.status}`}
                  >
                    조회
                  </Link>
                </Button>
                <Button
                  size="xsmall"
                  onClick={() => approveColumnMutation.mutate(column.id)}
                >
                  승인
                </Button>
                <Button
                  variant="secondary"
                  size="xsmall"
                  onClick={() => setDeleteTargetId(column.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          className="mt-6 justify-center"
          page={page}
          totalPages={data.totalPages}
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
