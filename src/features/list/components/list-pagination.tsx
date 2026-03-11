'use client';

import { useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/shared/components/ui';

type Props = {
  currentPage: number;
  totalPages: number;
};

export const ListPagination = ({ currentPage, totalPages }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <Pagination
      className="mt-10 justify-center"
      page={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};
