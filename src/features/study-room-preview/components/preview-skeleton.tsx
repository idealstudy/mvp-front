'use client';

import { Skeleton } from '@/shared/components/loading';

export const PreviewSideSkeleton = () => {
  return (
    <section className="flex flex-col gap-5 px-2 py-3">
      <div className="flex flex-col gap-3">
        <Skeleton.Block className="tablet:h-[300px] h-[200px] w-full rounded-xl" />
        <Skeleton.Block className="h-7 w-3/4" />
        <Skeleton.Block className="h-5 w-1/2" />
      </div>

      <div className="border-gray-3 flex items-center justify-between rounded-lg border px-3 py-4">
        <Skeleton.Block className="h-10 w-16" />
        <Skeleton.Block className="h-10 w-16" />
        <Skeleton.Block className="h-10 w-16" />
      </div>

      <Skeleton.Block className="h-12 w-full rounded-xl" />

      <div className="flex flex-col gap-2">
        <Skeleton.Block className="h-5 w-1/2" />
        <div className="flex flex-col gap-2">
          <Skeleton.Block className="h-9 w-full rounded-lg" />
          <Skeleton.Block className="h-9 w-full rounded-lg" />
          <Skeleton.Block className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export const PreviewMainSkeleton = () => {
  return (
    <section className="flex w-full flex-col gap-6 px-6 py-8">
      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <Skeleton.Block className="h-7 w-1/3" />
        <Skeleton.Block className="h-4 w-2/3" />
        <div className="flex flex-col gap-2">
          <Skeleton.Block className="h-5 w-full" />
          <Skeleton.Block className="h-5 w-11/12" />
          <Skeleton.Block className="h-5 w-10/12" />
        </div>
      </article>

      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <Skeleton.Block className="h-7 w-2/5" />
        <div className="tablet:flex-row flex flex-col gap-4">
          <Skeleton.Block className="tablet:w-1/3 h-12 w-full" />
          <Skeleton.Block className="tablet:w-1/3 h-12 w-full" />
          <Skeleton.Block className="tablet:w-1/3 h-12 w-full" />
        </div>
      </article>

      <article className="bg-system-background-alt flex flex-col gap-4 rounded-xl p-6">
        <Skeleton.Block className="h-7 w-1/3" />
        <Skeleton.Block className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton.Block className="h-9 w-24 rounded-xl" />
          <Skeleton.Block className="h-9 w-24 rounded-xl" />
          <Skeleton.Block className="h-9 w-24 rounded-xl" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton.Block className="h-24 w-full rounded-lg" />
          <Skeleton.Block className="h-24 w-full rounded-lg" />
          <Skeleton.Block className="h-24 w-full rounded-lg" />
        </div>
      </article>
    </section>
  );
};
