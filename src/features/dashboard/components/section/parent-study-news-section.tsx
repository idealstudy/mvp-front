import {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardStudyNewsListDTO,
} from '@/entities/parent';
import { Skeleton } from '@/shared/components/loading';

import { StudyNewsItem } from '../section-content/parent-study-news-item';
import DashboardSection from './single-section';
import { StudyRoomDropdown } from './tabbed-section';

interface StudyNewsSectionProps {
  connectedStudentData: ParentDashboardConnectedStudentListDTO;
  studyNewsData: ParentDashboardStudyNewsListDTO;
  studyNewsPending: boolean;
  selectedStudentId: number | null;
  setSelectedStudentId: (id: number | null) => void;
}

export const StudyNewsSection = ({
  connectedStudentData,
  studyNewsData,
  studyNewsPending,
  selectedStudentId,
  setSelectedStudentId,
}: StudyNewsSectionProps) => {
  const studentOptions = connectedStudentData.map((student) => ({
    id: student.studentId,
    name: student.studentName,
  }));

  const connectedStudentLength = connectedStudentData.length;
  const studyNewsContentLength = studyNewsData.totalElements;
  const limitStudyNews = studyNewsData.content.slice(0, 5);

  const title =
    connectedStudentLength === 1
      ? `${connectedStudentData[0]?.studentName} 학생의 학습 소식`
      : '학생의 학습 소식';

  const headerAction =
    connectedStudentLength > 1 ? (
      <StudyRoomDropdown
        studyRooms={studentOptions}
        selectedId={selectedStudentId}
        onSelect={setSelectedStudentId}
        parent
      />
    ) : null;

  let content;

  if (studyNewsPending) {
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
  } else if (studyNewsContentLength === 0) {
    content = (
      <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
        <p className="font-body2-normal text-gray-8">학습 소식이 없어요.</p>
      </div>
    );
  } else {
    content = (
      <div className="flex w-full flex-col">
        {limitStudyNews.map((data) => (
          <StudyNewsItem
            key={`${data.type}-${data.id}`}
            data={data}
            selectedStudentId={selectedStudentId}
          />
        ))}
      </div>
    );
  }

  return (
    <section>
      <DashboardSection
        title={title}
        isMoreHref={
          selectedStudentId !== null
            ? `/dashboard/study-news?studentId=${selectedStudentId}`
            : '/dashboard/study-news'
        }
        headerAction={headerAction}
        count={studyNewsContentLength}
        isMore={studyNewsContentLength === 0 ? false : true}
        isMoreDescription="전체보기"
      >
        {content}
      </DashboardSection>
    </section>
  );
};
