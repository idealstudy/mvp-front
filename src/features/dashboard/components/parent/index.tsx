import DashboardHeader from '../header';
import { ClassConsultationHistorySection } from '../section/parent-class-consultation-history-section';
import { ConsultationSection } from '../section/parent-consultation-section';
import { ParentLinkSection } from '../section/parent-link-section';
import { StudyNewsSection } from '../section/parent-study-news-section';
import { StudyRoomBrowseSection } from '../section/parent-studyroom-browse-section';

const DashboardParent = () => {
  //TODO: 부모님 대시보드 api 추가 예정
  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        <ParentLinkSection />
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <StudyNewsSection />
          <ConsultationSection />
          <StudyRoomBrowseSection />
          <ClassConsultationHistorySection />
        </div>
      </main>
    </div>
  );
};

export default DashboardParent;
