'use client';

import { useState, useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { type MyChallengeListItem } from '@/entities/open-challenge';
import { MyOpenChallengeDetailDialog } from '@/features/mypage/open-challenge/components/my-open-challenge-detail-dialog';
import { useMyOpenChallenges } from '@/features/mypage/open-challenge/hooks/use-my-open-challenges';
import SectionContainer from '@/features/profile/components/section-container';
import { DropdownMenu, Pagination, StatusBadge } from '@/shared/components/ui';
import { ListItem } from '@/shared/components/ui/list-item';
import { PUBLIC } from '@/shared/constants';
import { getRelativeTimeString } from '@/shared/lib';

const DIFFICULTY_LABEL = {
  TOP: '최상',
  HIGH: '상',
  MID: '중',
  LOW: '하',
} as const;

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export const MyOpenChallengeList = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selectedChallenge, setSelectedChallenge] =
    useState<MyChallengeListItem | null>(null);

  const currentPage = parsePage(searchParams.get('page') ?? undefined);
  const { data, isLoading, isError, refetch } = useMyOpenChallenges({
    result: 'ALL',
    page: currentPage - 1,
  });
  const totalPages = data?.hasNext ? currentPage + 1 : currentPage;

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'open-challenges');
    params.set('page', String(page));
    params.delete('result');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    });
  };

  return (
    <>
      <SectionContainer
        title="내 오픈챌린지 답안"
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        isOwner
        action={
          <Link
            href={PUBLIC.OPEN_CHALLENGE.LIST}
            className="font-label-normal text-key-color-primary hover:underline"
          >
            오픈챌린지 가기
          </Link>
        }
      >
        {data && data.content.length > 0 ? (
          <>
            {data.content.map((challenge) => (
              <ListItem.Button
                key={challenge.challengeId}
                id={Number(challenge.challengeId)}
                title={challenge.questionText}
                subtitle={`${challenge.sourceText} | 마지막 제출 ${getRelativeTimeString(challenge.completedAt)}`}
                rightTitle={
                  <StatusBadge
                    label={DIFFICULTY_LABEL[challenge.difficulty]}
                    variant="default"
                  />
                }
                onClick={() => setSelectedChallenge(challenge)}
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
                    <DropdownMenu.Content className="w-[132px] justify-center">
                      <DropdownMenu.Item asChild>
                        <Link
                          href={PUBLIC.OPEN_CHALLENGE.DETAIL(
                            challenge.challengeId
                          )}
                          className="justify-center border-none focus:ring-0 focus:outline-none"
                        >
                          문제 보러가기
                        </Link>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                }
              />
            ))}

            <Pagination
              className="mt-6 justify-center"
              page={currentPage}
              totalPages={totalPages}
              onPageChange={updatePage}
            />
          </>
        ) : (
          <p className="text-gray-5 py-10 text-center text-sm">
            제출한 오픈챌린지 답안이 없습니다.
          </p>
        )}
      </SectionContainer>

      {selectedChallenge && (
        <MyOpenChallengeDetailDialog
          challengeId={selectedChallenge.challengeId}
          challenge={selectedChallenge}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedChallenge(null);
          }}
        />
      )}
    </>
  );
};
