import Link from 'next/link';

import { ParentDashboardStudyRoomPreviewListDTO } from '@/entities/parent';
import { StudyRoomCard } from '@/features/list';

export const StudyRoomPreviewItem = ({
  studyRoom,
}: {
  studyRoom: ParentDashboardStudyRoomPreviewListDTO;
}) => {
  return (
    <div className="tablet:grid-cols-4 grid grid-cols-1 gap-4">
      {studyRoom.map((item) => (
        <Link
          key={item.id}
          href={`/study-room-preview/${item.id}/${item.teacherId}`}
        >
          <StudyRoomCard
            studyRoom={{
              ...item,
              visibility: 'PUBLIC',
              createdAt: '',
            }}
          />
        </Link>
      ))}
    </div>
  );
};
