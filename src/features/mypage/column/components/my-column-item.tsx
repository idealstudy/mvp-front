'use client';

import Image from 'next/image';
import Link from 'next/link';

import { MyColumnListItem } from '@/entities/column';
import { useDeleteColumn } from '@/features/community/column/hooks/use-column-form';
import { DropdownMenu } from '@/shared/components/ui';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE, PUBLIC } from '@/shared/constants';
import { cn, getRelativeTimeString } from '@/shared/lib';

const COLUMN_STATUS_LABEL = { PENDING_APPROVAL: '승인 대기', APPROVED: '승인' };

export default function MyColumnItem({ column }: { column: MyColumnListItem }) {
  const deleteMutation = useDeleteColumn();

  return (
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
              onClick={() => deleteMutation.mutate(column.id)}
              disabled={deleteMutation.isPending}
            >
              삭제하기
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      }
    />
  );
}
