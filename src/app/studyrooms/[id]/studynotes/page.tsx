'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { ColumnLayout } from '@/components/layout/column-layout';
import { StudyroomSidebar } from '@/features/studyrooms/components/sidebar';
import { StudyNotes } from '@/features/studyrooms/components/studynotes';
import { StudyRoomTabs } from '@/features/studyrooms/components/taps';

export default function StudyRoomDetailPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | 'all'>('all');
  const { id } = useParams();

  const handleSelectGroupId = (id: number | 'all') => {
    setSelectedGroupId(id);
  };

  return (
    <main>
      <ColumnLayout>
        <ColumnLayout.Left className="rounded-[12px] bg-gray-200">
          <StudyroomSidebar
            studyRoomId={Number(id)}
            selectedGroupId={selectedGroupId}
            handleSelectGroupId={handleSelectGroupId}
          />
        </ColumnLayout.Left>
        <ColumnLayout.Right className="desktop:max-w-[740px] flex h-[400px] flex-col gap-3 rounded-[12px] px-8">
          <StudyRoomTabs />
          <StudyNotes selectedGroupId={selectedGroupId} />
        </ColumnLayout.Right>
      </ColumnLayout>
    </main>
  );
}
