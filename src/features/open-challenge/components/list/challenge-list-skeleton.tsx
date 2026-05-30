import { Skeleton } from '@/shared/components/loading';

const ChallengeCardSkeleton = () => (
  <div className="border-line-line1 flex flex-col gap-3 rounded-xl border bg-white p-4">
    <Skeleton.Block className="h-40 w-full rounded-lg" />
    <Skeleton.Block className="h-5 w-3/4" />
    <div className="flex gap-2">
      <Skeleton.Block className="h-5 w-16 rounded-full" />
      <Skeleton.Block className="h-5 w-12 rounded-full" />
    </div>
    <div className="flex justify-between">
      <Skeleton.Block className="h-4 w-1/3" />
      <Skeleton.Block className="h-4 w-1/4" />
    </div>
  </div>
);

export const ChallengeListSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton.Block className="h-20 w-full rounded-xl" />
    <div className="flex justify-end">
      <Skeleton.Block className="h-9 w-24 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ChallengeCardSkeleton />
      <ChallengeCardSkeleton />
      <ChallengeCardSkeleton />
    </div>
  </div>
);
