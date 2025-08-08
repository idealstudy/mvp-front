import { ColumnLayout } from '@/components/layout/column-layout';

import { getStudyNoteDetail } from '../service/api';

const StudyNoteDetailMetaSection = async ({ id }: { id: string }) => {
  const { studyRoomName, title } = await getStudyNoteDetail(Number(id));

  return (
    <ColumnLayout.Left className="border-line-line1 h-fit space-y-5 rounded-xl border bg-white p-20">
      <div className="text-key-color-primary">{studyRoomName}</div>
      <h1 className="text-text-main text-2xl font-bold">{title}</h1>
      <hr className="border-line-line1 border" />
      <div className="space-y-2"></div>
    </ColumnLayout.Left>
  );
};

export default StudyNoteDetailMetaSection;
