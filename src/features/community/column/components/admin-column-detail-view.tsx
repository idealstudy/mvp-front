'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import DeleteColumnDialog from '@/features/community/column/components/delete-column-dialog';
import {
  useAdminColumnDetail,
  useApproveColumn,
} from '@/features/community/column/hooks/use-admin-column';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { getRelativeTimeString } from '@/shared/lib';
import { classifyColumnError, handleApiError } from '@/shared/lib/errors';

export default function AdminColumnDetailView({
  id,
  isPending,
}: {
  id: number;
  isPending: boolean;
}) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, isLoading, isError } = useAdminColumnDetail(id);
  const approveColumnMutation = useApproveColumn();
  const deleteColumnMutation = useDeleteColumn();

  // 삭제
  const handleDeleteConfirm = () => {
    deleteColumnMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        router.push(PRIVATE.ADMIN.COLUMN.LIST);
      },
      onError: (error) => {
        handleApiError(error, classifyColumnError, {
          // COLUMN_ARTICLE_NOT_EXIST
          onContext: () => {
            setIsDeleteOpen(false);
            setTimeout(() => router.push(PRIVATE.ADMIN.COLUMN.LIST), 1500);
          },
        });
      },
    });
  };

  // 승인
  const handleApprove = () => {
    approveColumnMutation.mutate(id, {
      onSuccess: () => router.push(PRIVATE.ADMIN.COLUMN.LIST),
      onError: (error) => {
        handleApiError(error, classifyColumnError, {
          // COLUMN_ARTICLE_ALREADY_APPROVED, COLUMN_ARTICLE_NOT_EXIST
          onContext: () => {
            setTimeout(() => router.push(PRIVATE.ADMIN.COLUMN.LIST), 1500);
          },
        });
      },
    });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>데이터를 불러올 수 없습니다.</div>;

  const content = parseEditorContent(data.resolvedContent.content);

  return (
    <>
      <article>
        {isPending && (
          <div className="bg-gray-1 font-label-normal mb-6 rounded-lg py-3 text-center">
            승인 대기 중인 글입니다.
          </div>
        )}
        <div className="mb-6 flex items-start justify-between gap-4">
          <h1 className="font-title-heading">{data.title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            {isPending && (
              <Button
                size="xsmall"
                onClick={handleApprove}
              >
                승인
              </Button>
            )}
            <Button
              variant="secondary"
              size="xsmall"
              onClick={() => setIsDeleteOpen(true)}
            >
              삭제
            </Button>
          </div>
        </div>
        <div className="text-text-sub2 font-label-normal mb-6 flex gap-4">
          <span>{data.authorNickname ?? '알 수 없음'}</span>
          <span>{getRelativeTimeString(data.regDate)}</span>
          <span>조회 {data.viewCount}</span>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="bg-orange-2 font-label-normal rounded-lg px-3 py-1"
            >
              # {tag}
            </span>
          ))}
        </div>
        <TextViewer value={content} />
      </article>
      {/* 삭제 확인 Dialog */}
      <DeleteColumnDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
