'use client';

import { useTransition } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/shared/components/ui';
import { Inbox } from 'lucide-react';

import { useOpenChallengeListQuery } from '../../hooks/use-open-challenge';
import { ChallengeCard } from './challenge-card';
import { ChallengeListSkeleton } from './challenge-list-skeleton';

type SortOption = 'latest' | 'popular';

const PAGE_SIZE = 12;

type ChallengeListClientProps = {
  sort: SortOption;
  page: number;
};

export const ChallengeListClient = ({
  sort,
  page,
}: ChallengeListClientProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const { data: challenges, isLoading } = useOpenChallengeListQuery({
    subject: 'ALL',
    sort,
  });

  const totalPages = Math.ceil((challenges?.length ?? 0) / PAGE_SIZE);
  const visibleChallenges = (challenges ?? []).slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <>
      {isLoading ? (
        <ChallengeListSkeleton />
      ) : (
        <>
          {visibleChallenges.length > 0 ? (
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {visibleChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                />
              ))}
            </div>
          ) : (
            <div className="border-line-line1 flex flex-col items-center gap-2 rounded-xl border bg-white py-16 text-center">
              <Inbox
                size={36}
                className="text-gray-6"
              />
              <p className="font-body1-heading text-text-main">
                아직 등록된 문제가 없어요.
              </p>
              <p className="text-gray-8 text-sm">
                새 문제가 등록되면 이곳에 보여요.
              </p>
            </div>
          )}

          {(challenges?.length ?? 0) > PAGE_SIZE && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-10 justify-center"
            />
          )}
        </>
      )}
    </>
  );
};
