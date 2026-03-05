import { useStudentStudyRoomsQuery } from '@/features/study-rooms';

import { useOnboardingStatus } from '../../hooks/use-onboarding-status';
import DashboardHeader from '../header';
import QnASection from '../section/qna-section';
import StudentTabSection from '../section/student-tab-section';
import StudyroomSection from '../section/studyroom-section';
import StudentOnboarding from './student-onboarding';

export const DashboardStudent = () => {
  const { data: studyRooms } = useStudentStudyRoomsQuery();
  const { hasRooms, hasNotes, hasAssignments, hasQuestions } =
    useOnboardingStatus({ rooms: studyRooms });
  const studentStepsCompleted = [
    hasRooms,
    hasNotes,
    hasAssignments,
    hasQuestions,
  ].every(Boolean);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!studentStepsCompleted && <StudentOnboarding />}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <QnASection />
          <StudyroomSection />
          <StudentTabSection />
        </div>
      </main>
    </div>
  );
};

export default DashboardStudent;
