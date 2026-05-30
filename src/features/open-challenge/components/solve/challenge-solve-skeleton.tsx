import { Skeleton } from '@/shared/components/loading';

export const ChallengeSolveSkeleton = () => (
  <div className="flex h-[calc(100vh-var(--spacing-header-height,64px))] overflow-hidden">
    <aside className="border-line-line1 hidden w-[380px] shrink-0 border-r p-4 lg:block">
      <div className="flex h-full flex-col gap-4">
        <Skeleton.Block className="h-10 w-full rounded-lg" />
        <Skeleton.Block className="min-h-[300px] w-full flex-1 rounded-xl" />
        <Skeleton.Block className="h-10 w-full rounded-lg" />
      </div>
    </aside>

    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <Skeleton.Block className="mb-5 h-8 w-16 rounded-lg" />
        <Skeleton.Block className="mb-3 h-5 w-56" />

        <div className="border-line-line1 mb-5 overflow-hidden rounded-xl border bg-white p-5">
          <div className="flex flex-col gap-3">
            <Skeleton.Block className="h-6 w-2/3" />
            <Skeleton.Block className="h-5 w-full" />
            <Skeleton.Block className="h-5 w-11/12" />
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <Skeleton.Block className="h-5 w-24" />
          <Skeleton.Block className="h-[420px] w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton.Block className="h-5 w-40" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton.Block
              key={i}
              className="h-12 w-full rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="border-line-line1 flex items-center justify-end border-t bg-white px-4 py-2 sm:px-6">
        <Skeleton.Block className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);
