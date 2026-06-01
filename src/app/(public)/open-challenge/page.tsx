import { ChallengeListClient } from '@/features/open-challenge/components/list/challenge-list-client';
import OpenChallengeShell from '@/features/open-challenge/components/open-challenge-shell';

type OpenChallengePageProps = {
  searchParams: Promise<{ sort?: string; page?: string }>;
};

const parseSort = (value?: string) => {
  if (value === 'popular') return value;
  return 'latest';
};

const parsePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
};

export default async function OpenChallengePage({
  searchParams,
}: OpenChallengePageProps) {
  const { sort, page } = await searchParams;

  return (
    <OpenChallengeShell>
      <ChallengeListClient
        sort={parseSort(sort)}
        page={parsePage(page)}
      />
    </OpenChallengeShell>
  );
}
