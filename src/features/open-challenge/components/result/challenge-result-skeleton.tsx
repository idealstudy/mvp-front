import { Skeleton } from '@/shared/components/loading';

export const ChallengeResultSkeleton = () => (
  <main className="tablet:px-8 mx-auto w-full max-w-[1200px] px-4 py-8">
    <Skeleton.Block className="mb-6 h-8 w-16 rounded-lg" />

    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="border-line-line1 rounded-xl border bg-white p-5">
          <div className="flex flex-col gap-4">
            <Skeleton.Block className="h-8 w-1/3" />
            <div className="flex gap-6">
              <Skeleton.Block className="h-14 w-24 rounded-lg" />
              <Skeleton.Block className="h-14 w-24 rounded-lg" />
              <Skeleton.Block className="h-14 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton.Block className="h-6 w-40" />
          {[0, 1, 2].map((i) => (
            <Skeleton.Block
              key={i}
              className="h-24 w-full rounded-lg"
            />
          ))}
        </div>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:w-[340px] lg:shrink-0">
        <Skeleton.Block className="h-40 w-full rounded-xl" />
        <Skeleton.Block className="h-32 w-full rounded-xl" />
      </aside>
    </div>
  </main>
);
