import { Skeleton } from '@/shared/components/loading';

const ChallengeCardSkeleton = () => (
  <div className="border-line-line1 flex min-h-full flex-col overflow-hidden rounded-xl border">
    <Skeleton.Block className="h-[200px] w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-3 bg-white p-5">
      <div className="flex flex-col gap-1">
        <Skeleton.Block className="h-4 w-2/5" />
        <Skeleton.Block className="mt-1 h-5 w-full" />
        <Skeleton.Block className="h-5 w-3/4" />
        <Skeleton.Block className="mt-0.5 h-4 w-1/2" />
      </div>
      <div className="border-line-line1 mt-auto flex items-center gap-3 border-t pt-3">
        <Skeleton.Block className="h-4 w-1/4" />
        <Skeleton.Block className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);

export const ChallengeListSkeleton = () => (
  <div className="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-6">
    <ChallengeCardSkeleton />
    <ChallengeCardSkeleton />
    <ChallengeCardSkeleton />
    <ChallengeCardSkeleton />
    <ChallengeCardSkeleton />
    <ChallengeCardSkeleton />
  </div>
);
