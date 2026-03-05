import { useTeacherOnboardingQuery } from '@/features/dashboard/hooks/use-onboarding-query';

import DashboardHeader from '../header';
import QnASection from '../section/qna-section';
import StudyroomSection from '../section/studyroom-section';
import TeacherTabSection from '../section/teacher-tab-section';
import TeacherOnboarding from './teacher-onboarding';

const DashboardTeacher = () => {
  const { data: teacherOnboarding } = useTeacherOnboardingQuery();

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!teacherOnboarding?.isCompleted && <TeacherOnboarding />}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <QnASection />
          <StudyroomSection />
          <TeacherTabSection />
        </div>
      </main>
    </div>
  );
};

export default DashboardTeacher;
