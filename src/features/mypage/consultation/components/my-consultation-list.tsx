'use client';

import { useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMyConsultations } from '@/features/consultation/hooks/use-my-consultations';
import MyConsultationItem from '@/features/mypage/consultation/components/my-consultation-item';
import SectionContainer from '@/features/profile/components/section-container';
import { Pagination } from '@/shared/components/ui';

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export default function MyConsultationList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const currentPage = parsePage(searchParams.get('page') ?? undefined);

  const { data, isLoading, isError, refetch } = useMyConsultations(
    currentPage - 1
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <SectionContainer
      title="내 문의 목록"
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      isOwner
    >
      {data && data.content.length > 0 ? (
        <>
          {data.content.map((item) => (
            <MyConsultationItem
              key={item.id}
              item={item}
            />
          ))}

          <Pagination
            className="mt-6 justify-center"
            page={currentPage}
            totalPages={data.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-gray-5 py-10 text-center text-sm">
          작성한 문의가 없습니다.
        </p>
      )}
    </SectionContainer>
  );
}
