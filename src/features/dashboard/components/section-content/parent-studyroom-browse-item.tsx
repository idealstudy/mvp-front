import { PublicStudyRoom, StudyRoomCard } from '@/features/list';

export const StudyRoomPreviewItem = ({
  studyRoom,
}: {
  studyRoom: PublicStudyRoom[];
}) => {
  return (
    <div className="tablet:grid-cols-4 grid grid-cols-1 gap-4">
      {studyRoom.map((item) => (
        <div key={item.id}>
          <StudyRoomCard
            studyRoom={{
              ...item,
              visibility: 'PUBLIC',
              createdAt: '',
            }}
          />
        </div>
      ))}
    </div>
  );
};
