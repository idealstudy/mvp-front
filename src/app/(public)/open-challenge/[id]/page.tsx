import { ChallengeSolveClient } from '@/features/open-challenge/components/solve/challenge-solve-client';
import { MOCK_CHALLENGE_DETAIL } from '@/features/open-challenge/mock/challenge-detail';

type PageProps = {
  params: Promise<{ id: string }>;
};

// TODO: isLoggedIn → 실제 인증 상태로 교체 (fetchMemberRole 사용)
const IS_LOGGED_IN_PLACEHOLDER = true;

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <ChallengeSolveClient
      challengeId={id}
      challenge={MOCK_CHALLENGE_DETAIL}
      isLoggedIn={IS_LOGGED_IN_PLACEHOLDER}
    />
  );
}
