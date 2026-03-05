import BackLink from '@/features/dashboard/studynote/components/back-link';
import StudyRoomFlow from '@/features/study-rooms/components/create/study-room-flow';
import { ColumnLayout } from '@/layout';

type Props = {
  params: { id: string };
};

export default function EditStudyRoomPage({ params }: Props) {
  const studyRoomId = Number(params.id);
  return (
    <div className="w-full flex-col">
      <BackLink />
      <ColumnLayout className="justify-center rounded-md bg-white">
        <StudyRoomFlow
          mode="edit"
          studyRoomId={studyRoomId}
        />
      </ColumnLayout>
    </div>
  );
}
