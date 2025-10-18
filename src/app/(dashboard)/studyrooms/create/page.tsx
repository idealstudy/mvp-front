import React from 'react';

import { ColumnLayout } from '@/components/layout/column-layout';
import { Sidebar } from '@/components/layout/sidebar';
import CreateStudyRoomFlow from '@/features/studyrooms/components/create/CreateStudyRoomFlow';

export default function CreateStudyRoomPage() {
  return (
    <div className="desktop:pl-sidebar-width flex flex-col bg-[#F9F9F9]">
      <Sidebar />
      <ColumnLayout className="container mx-auto">
        <CreateStudyRoomFlow />
      </ColumnLayout>
    </div>
  );
}
