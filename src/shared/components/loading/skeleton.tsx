import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@/shared/lib';

type SkeletonProps = ComponentPropsWithRef<'div'>;

interface SkeletonGridProps {
  count?: number;
  className: string;
  renderItem: (index: number) => ReactNode;
}

const SkeletonGrid = ({
  count = 16,
  className,
  renderItem,
}: SkeletonGridProps) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderItem(index)}</div>
      ))}
    </div>
  );
};

const SkeletonBlock = ({ className }: { className?: string }) => {
  return <div className={cn('bg-gray-3 animate-pulse rounded', className)} />;
};

type SkeletonComponent = ((props: SkeletonProps) => ReactNode) & {
  Grid: typeof SkeletonGrid;
  Block: typeof SkeletonBlock;
};

export const Skeleton = (({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(className)}
      {...props}
    />
  );
}) as SkeletonComponent;

Skeleton.Grid = SkeletonGrid;
Skeleton.Block = SkeletonBlock;
