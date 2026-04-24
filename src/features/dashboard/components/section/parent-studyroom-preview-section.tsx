import type { PublicStudyRoom } from '@/features/list';
import { Skeleton } from '@/shared/components/loading';

import { StudyRoomPreviewItem } from '../section-content/parent-studyroom-browse-item';
import DashboardSection from './single-section';

interface StudyRoomPreviewSectionProps {
  studyRoomPreviewData: PublicStudyRoom[];
  studyRoomPreviewIsPending: boolean;
}
export const StudyRoomPreviewSection = ({
  studyRoomPreviewData,
  studyRoomPreviewIsPending,
}: StudyRoomPreviewSectionProps) => {
  const limitStudyRooms = studyRoomPreviewData.slice(0, 4);
  const studyRoomPreviewDataLength = studyRoomPreviewData.length;

  let content;

  if (studyRoomPreviewIsPending) {
    content = (
      <div className="flex w-full flex-col gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton.Block
            key={i}
            className="h-12"
          />
        ))}
      </div>
    );
  } else if (studyRoomPreviewDataLength === 0) {
    content = (
      <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
        <p className="font-body2-normal text-gray-8">스터디룸이 없어요.</p>
      </div>
    );
  } else {
    content = <StudyRoomPreviewItem studyRoom={limitStudyRooms} />;
  }

  return (
    <section>
      <DashboardSection
        title="스터디룸 둘러보기"
        description="디에듀가 엄선한 학습 공간을 확인해보세요."
        isMoreHref="/list/study-rooms"
        isMore={studyRoomPreviewDataLength === 0 ? false : true}
      >
        {content}
      </DashboardSection>
    </section>
  );
};
