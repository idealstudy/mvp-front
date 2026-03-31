'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ColumnSortOption } from '@/entities/column';
import ColumnCard from '@/features/community/column/components/column-card';
import { ColumnListSkeleton } from '@/features/community/column/components/column-card-skeleton';
import { useColumnList } from '@/features/community/column/hooks/use-column-list';
import { Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { useMemberStore } from '@/store';
import { PenBox } from 'lucide-react';

const parseSort = (value?: string): ColumnSortOption => {
  if (value === 'POPULAR') return value;
  return 'LATEST';
};

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export default function ColumnList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = parseSort(searchParams.get('sort') ?? undefined);
  const currentPage = parsePage(searchParams.get('page') ?? undefined);

  const role = useMemberStore((state) => state.member?.role);
  const canWrite = role === 'ROLE_TEACHER' || role === 'ROLE_ADMIN';

  const router = useRouter();
  const [, startTransition] = useTransition();

  const { data, isLoading, isError } = useColumnList({
    page: currentPage - 1,
    sort,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  if (isLoading) return <ColumnListSkeleton />;
  if (isError) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <>
      {role === 'ROLE_TEACHER' && (
        <div className="mb-6 flex justify-end">
          <Link
            href={`${PRIVATE.MYPAGE}?tab=columns`}
            className="text-key-color-primary hover:underline"
          >
            내 칼럼 관리
          </Link>
        </div>
      )}

      <div className="tablet:grid-cols-2 grid gap-6">
        {data?.content.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
          />
        ))}
      </div>
      <Pagination
        className="mt-10 justify-center"
        page={currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />

      {canWrite && (
        <Link
          href={PRIVATE.COMMUNITY.COLUMN.CREATE}
          className="bg-orange-7 group fixed right-8 bottom-8 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:w-32 hover:gap-2"
        >
          <PenBox
            size={24}
            className="shrink-0 text-white"
          />
          <span className="font-body1-heading max-w-0 overflow-hidden whitespace-nowrap text-white transition-all duration-300 group-hover:max-w-15">
            작성하기
          </span>
        </Link>
      )}
    </>
  );
}
