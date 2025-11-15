import React from 'react';

import CreateStudyRoomFlow from '@/features/study-rooms/components/create/CreateStudyRoomFlow';
import { ColumnLayout } from '@/layout/column-layout';

export default function CreateStudyRoomPage() {
  return (
    <div className="desktop:pl-sidebar-width flex flex-col bg-[#F9F9F9]">
      {/*<Sidebar />*/}
      <ColumnLayout className="container mx-auto">
        <CreateStudyRoomFlow />
      </ColumnLayout>
    </div>
  );
}
