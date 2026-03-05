import { Skeleton } from '@/shared/components/loading';
import { cn } from '@/shared/lib';

const TeacherCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'border-gray-3 relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border bg-white p-4 md:p-6',
        className
      )}
    >
      <Skeleton.Block className="h-[100px] w-[100px] shrink-0 rounded-full" />

      <div className="flex flex-1 flex-col gap-3">
        <Skeleton.Block className="h-5 w-2/5" />
        <Skeleton.Block className="h-4 w-3/5" />
        <Skeleton.Block className="h-4 w-4/5" />
        <div className="mt-2 flex justify-end">
          <Skeleton.Block className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};

const StudyRoomCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'border-gray-scale-gray-10 overflow-hidden rounded-2xl border-[1.5px] bg-white',
        className
      )}
    >
      <div className="bg-orange-1 flex flex-col gap-[10px] p-6">
        <Skeleton.Block className="h-6 w-3/5" />
        <Skeleton.Block className="h-5 w-full" />
        <Skeleton.Block className="h-5 w-4/5" />
      </div>

      <div className="border-gray-scale-gray-10 border-t-1 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton.Block className="h-5 w-1/3" />
          <Skeleton.Block className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

const listClassName =
  'grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]';

export const TeachersListSkeleton = ({ count = 16 }: { count?: number }) => {
  return (
    <Skeleton.Grid
      count={count}
      className={`${listClassName}`}
      renderItem={() => <TeacherCardSkeleton />}
    />
  );
};

export const StudyRoomsListSkeleton = ({ count = 16 }: { count?: number }) => {
  return (
    <Skeleton.Grid
      count={count}
      className={`${listClassName}`}
      renderItem={() => <StudyRoomCardSkeleton />}
    />
  );
};
