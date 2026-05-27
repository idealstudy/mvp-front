import { ChallengeListClient } from '@/features/open-challenge/components/list/challenge-list-client';
import {
  MOCK_CHALLENGES,
  MOCK_STREAK,
} from '@/features/open-challenge/mock/challenges';

export default function OpenChallengePage() {
  return (
    <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
      <ChallengeListClient
        challenges={MOCK_CHALLENGES}
        streak={MOCK_STREAK}
      />
    </main>
  );
}
