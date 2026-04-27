import { useEffect, useMemo, useState } from 'react';

import { useStudentStudyRoomsQuery } from '@/features/study-rooms';
import { useMemberStore } from '@/store';

import { useReceivedConnectionList } from '../../connect/hooks/use-connection';
import { useOnboardingStatus } from '../../hooks/use-onboarding-status';
import DashboardHeader from '../header';
import CalendarSection from '../section/calendar-section';
import QnASection from '../section/qna-section';
import StudentTabSection from '../section/student-tab-section';
import { ConfirmParentRequestDialog } from './confirm-dialog';
import StudentOnboarding from './student-onboarding';

export const DashboardStudent = () => {
  const memberEmail = useMemberStore((s) => s.member?.email);
  const [isParentRequestDialogOpen, setIsParentRequestDialogOpen] =
    useState(false);
  const { data: studyRooms } = useStudentStudyRoomsQuery();
  const { hasRooms, hasNotes, hasAssignments, hasQuestions } =
    useOnboardingStatus({ rooms: studyRooms });
  const studentStepsCompleted = [
    hasRooms,
    hasNotes,
    hasAssignments,
    hasQuestions,
  ].every(Boolean);
  const query = {
    page: 0,
    size: 10,
    sort: 'regDate,DESC',
  };

  const { data: receivedData } = useReceivedConnectionList(query);
  const receivedParentRequest = useMemo(
    () =>
      receivedData?.contentList.find(
        (connection) =>
          connection.state === 'PENDING' &&
          connection.recipientEmail === memberEmail
      ) ?? null,
    [memberEmail, receivedData?.contentList]
  );

  useEffect(() => {
    if (!receivedParentRequest) return;

    setIsParentRequestDialogOpen(true);
  }, [receivedParentRequest]);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!studentStepsCompleted && <StudentOnboarding />}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <QnASection />
          <CalendarSection />
          <StudentTabSection />
        </div>
      </main>
      <ConfirmParentRequestDialog
        connection={receivedParentRequest}
        open={isParentRequestDialogOpen}
        onOpenChange={setIsParentRequestDialogOpen}
      />
    </div>
  );
};

export default DashboardStudent;
