'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { MyColumnListItem, columnKeys } from '@/entities/column';
import DeleteColumnDialog from '@/features/community/column/components/delete-column-dialog';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { DropdownMenu } from '@/shared/components/ui';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE, PUBLIC } from '@/shared/constants';
import { cn, getRelativeTimeString } from '@/shared/lib';
import { classifyColumnError, handleApiError } from '@/shared/lib/errors';
import { useQueryClient } from '@tanstack/react-query';

const COLUMN_STATUS_LABEL = { PENDING_APPROVAL: '승인 대기', APPROVED: '승인' };

export default function MyColumnItem({ column }: { column: MyColumnListItem }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteColumn();
  const queryClient = useQueryClient();

  // 삭제
  const handleDelete = () => {
    deleteMutation.mutate(column.id, {
      onSuccess: () => setIsDeleteOpen(false),
      onError: (error) => {
        handleApiError(error, classifyColumnError, {
          // COLUMN_ARTICLE_NOT_OWNED, COLUMN_ARTICLE_NOT_EXIST
          onContext: () => {
            setIsDeleteOpen(false);
            queryClient.invalidateQueries({ queryKey: columnKeys.all });
          },
        });
      },
    });
  };

  return (
    <>
      <ListItem
        id={column.id}
        title={column.title}
        href={
          column.status === 'PENDING_APPROVAL'
            ? `${PUBLIC.COMMUNITY.COLUMN.DETAIL(column.id)}?preview=true`
            : PUBLIC.COMMUNITY.COLUMN.DETAIL(column.id)
        }
        subtitle={`조회수 ${column.viewCount} | 작성일 ${getRelativeTimeString(column.regDate)}`}
        rightTitle={
          <span
            className={cn(
              'font-label-normal px-3 py-1.5 whitespace-nowrap',
              column.status === 'PENDING_APPROVAL'
                ? 'bg-gray-1'
                : 'bg-orange-1 text-key-color-primary'
            )}
          >
            {COLUMN_STATUS_LABEL[column.status]}
          </span>
        }
        dropdown={
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Image
                src="/studynotes/gray-kebab.svg"
                width={24}
                height={24}
                alt="더보기"
                className="hover:bg-gray-scale-gray-5 cursor-pointer rounded"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-[110px] justify-center">
              <DropdownMenu.Item asChild>
                <Link
                  href={PRIVATE.COMMUNITY.COLUMN.EDIT(column.id)}
                  className="justify-center border-none focus:ring-0 focus:outline-none"
                >
                  수정하기
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                variant="danger"
                className="justify-center"
                onClick={() => setIsDeleteOpen(true)}
                disabled={deleteMutation.isPending}
              >
                삭제하기
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        }
      />

      {/* 삭제 확인 Dialog */}
      <DeleteColumnDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
