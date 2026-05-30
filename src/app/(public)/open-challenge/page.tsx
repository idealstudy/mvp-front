import { ChallengeListClient } from '@/features/open-challenge/components/list/challenge-list-client';

export default function OpenChallengePage() {
  return (
    <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
      <ChallengeListClient />
    </main>
  );
}
