import { ChallengeResult } from '@/features/open-challenge/components/result/challenge-result';
import {
  MOCK_NEXT_CHALLENGE,
  MOCK_RESULT,
  MOCK_SOLUTIONS,
} from '@/features/open-challenge/mock/challenge-result';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeResultPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <ChallengeResult
      challengeId={id}
      result={MOCK_RESULT}
      solutions={MOCK_SOLUTIONS}
      nextChallenge={MOCK_NEXT_CHALLENGE}
    />
  );
}
