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
  await params;

  return (
    <ChallengeResult
      result={MOCK_RESULT}
      solutions={MOCK_SOLUTIONS}
      nextChallenge={MOCK_NEXT_CHALLENGE}
    />
  );
}
