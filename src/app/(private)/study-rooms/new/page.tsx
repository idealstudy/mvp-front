import React from 'react';

import BackLink from '@/features/dashboard/studynote/components/back-link';
import StudyRoomFlow from '@/features/study-rooms/components/create/study-room-flow';
import { ColumnLayout } from '@/layout/column-layout';

export default function CreateStudyRoomPage() {
  return (
    <div className="flex flex-col bg-[#F9F9F9]">
      <BackLink />
      <ColumnLayout className="justify-center rounded-md bg-white">
        <StudyRoomFlow mode="create" />
      </ColumnLayout>
    </div>
  );
}
