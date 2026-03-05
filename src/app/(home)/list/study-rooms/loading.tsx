'use client';

import { useEffect, useState } from 'react';

import { StudyRoomsListSkeleton } from '@/features/list/components/card-skeleton';
import { MiniSpinner } from '@/shared/components/loading';

const SHOW_DELAY = 180;

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (!visible)
    return (
      <div className="flex justify-center py-10">
        <MiniSpinner />
      </div>
    );

  return <StudyRoomsListSkeleton />;
}
