import { ChallengeResult } from '@/features/open-challenge/components/result/challenge-result';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeResultPage({ params }: PageProps) {
  const { id } = await params;

  return <ChallengeResult challengeId={id} />;
}
