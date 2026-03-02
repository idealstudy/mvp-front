'use client';

import { useEffect, useState } from 'react';

import {
  PreviewMainSkeleton,
  PreviewSideSkeleton,
} from '@/features/study-room-preview/components/preview-skeleton';
import { ColumnLayout } from '@/layout';
import { MiniSpinner } from '@/shared/components/loading';

const SHOW_DELAY = 180;

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return (
      <div className="flex justify-center py-10">
        <MiniSpinner />
      </div>
    );
  }

  return (
    <div className="desktop:flex-row mt-4 flex flex-col gap-5">
      <ColumnLayout.Left className="border-line-line1 flex h-fit flex-col gap-5 rounded-xl border bg-white px-8 py-8">
        <PreviewSideSkeleton />
      </ColumnLayout.Left>
      <ColumnLayout.Right className="desktop:max-w-[740px] desktop:px-8 flex flex-col rounded-[12px]">
        <div className="border-line-line1 flex flex-col gap-9 rounded-[12px] border bg-white py-2">
          <PreviewMainSkeleton />
        </div>
      </ColumnLayout.Right>
    </div>
  );
}
