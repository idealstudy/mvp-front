import React from 'react';

import BackLink from '@/features/dashboard/studynote/components/back-link';
import StudyRoomFlow from '@/features/study-rooms/components/create/study-room-flow';
import { ColumnLayout } from '@/layout/column-layout';

export default function CreateStudyRoomPage() {
  return (
    <div className="flex flex-col bg-[#F9F9F9]">
      <ColumnLayout className="desktop:flex-col justify-center gap-0">
        <BackLink className="mb-8 pt-0" />
        <div className="tablet:p-8 rounded-md bg-white p-4">
          <StudyRoomFlow mode="create" />
        </div>
      </ColumnLayout>
    </div>
  );
}
