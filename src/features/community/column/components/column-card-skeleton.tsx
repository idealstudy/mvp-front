import { Skeleton } from '@/shared/components/loading';

function ColumnCardSkeleton() {
  return (
    <div className="border-gray-3 rounded-xl border-[1.5px] bg-white">
      <Skeleton.Block className="h-[150px] rounded-t-xl rounded-b-none" />
      <div className="px-6 py-4">
        <Skeleton.Block className="mb-2 h-5 w-3/4" />
        <Skeleton.Block className="mb-3 h-4 w-1/4" />
        <div className="flex justify-between">
          <Skeleton.Block className="h-3 w-1/3" />
          <Skeleton.Block className="h-3 w-1/5" />
        </div>
      </div>
    </div>
  );
}

export function ColumnListSkeleton({ count = 12 }: { count?: number }) {
  return (
    <Skeleton.Grid
      count={count}
      className="tablet:grid-cols-2 grid gap-6"
      renderItem={() => <ColumnCardSkeleton />}
    />
  );
}
