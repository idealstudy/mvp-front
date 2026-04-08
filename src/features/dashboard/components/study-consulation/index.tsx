'use client';

import { MoreContentsHeader } from '../more-contents-header';
import { ParentStudent } from '../types/parent-student';
import { StudyConsulationList } from './study-consulation-list';

export const StudyConsulation = ({ data }: { data: ParentStudent[] }) => {
  return (
    <div className="flex min-h-[calc(100vh-76px)] w-full flex-col">
      <MoreContentsHeader kind="STUDY_CONSULATION" />
      <StudyConsulationList data={data} />
    </div>
  );
};
