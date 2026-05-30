import { ChallengeSolveClient } from '@/features/open-challenge/components/solve/challenge-solve-client';
import { fetchMemberRole } from '@/shared/lib/server';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await fetchMemberRole();

  return (
    <ChallengeSolveClient
      challengeId={id}
      isLoggedIn={session.status === 'authenticated'}
    />
  );
}
