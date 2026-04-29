import { notFound } from 'next/navigation';

import StudyRoomFlow from '@/features/study-rooms/components/create/study-room-flow';
import { ColumnLayout } from '@/layout';
import { PRIVATE, PUBLIC } from '@/shared/constants';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: 'studyroom' | 'preview'; teacherId?: string }>;
};

export default async function EditStudyRoomPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { from, teacherId } = await searchParams;
  const studyRoomId = Number(id);
  const returnUrl =
    from === 'preview' && teacherId
      ? PUBLIC.STUDY_ROOM_PREVIEW.DETAIL(studyRoomId, Number(teacherId))
      : PRIVATE.ROOM.DETAIL(studyRoomId);

  if (!Number.isInteger(studyRoomId) || studyRoomId <= 0) {
    notFound();
  }
  return (
    <div className="w-full flex-col">
      <ColumnLayout className="desktop:flex-col justify-center gap-0">
        <div className="tablet:p-8 rounded-md bg-white p-4">
          <StudyRoomFlow
            mode="edit"
            studyRoomId={studyRoomId}
            returnUrl={returnUrl}
          />
        </div>
      </ColumnLayout>
    </div>
  );
}
