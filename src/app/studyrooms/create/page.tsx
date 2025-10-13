import React from 'react';

import { ColumnLayout } from '@/components/layout/column-layout';
import CreateStudyRoomFlow from '@/features/studyrooms/components/create/CreateStudyRoomFlow';

export default function CreateStudyRoomPage() {
  return (
    <ColumnLayout className="container mx-auto">
      <CreateStudyRoomFlow />
    </ColumnLayout>
  );
}
