import { StudyRoomCard } from '@/features/list';

import { StudyRoomBrowseItemType } from '../section/parent-studyroom-browse-section';

interface StudyRoomBrowseItemProps {
  studyRoom: StudyRoomBrowseItemType[];
}

export const StudyRoomBrowseItem = ({
  studyRoom,
}: StudyRoomBrowseItemProps) => {
  return (
    <div className="tablet:grid-cols-4 grid grid-cols-1 gap-4">
      {studyRoom.map((item) => (
        <StudyRoomCard
          key={item.id}
          studyRoom={{
            ...item,
            visibility: 'PUBLIC',
            createdAt: '',
          }}
        />
      ))}
    </div>
  );
};
