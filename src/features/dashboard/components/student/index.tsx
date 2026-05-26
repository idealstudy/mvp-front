import { useEffect, useMemo, useState } from 'react';

import { useMemberStore } from '@/store';

import { useReceivedConnectionList } from '../../connect/hooks/use-connection';
import { useOnboardingStatus } from '../../hooks/use-onboarding-status';
import { useStudentDashboardStudyRoomListQuery } from '../../hooks/use-student-dashboard-query';
import StudentDashboardHeader from '../header/student-header';
import CalendarSection from '../section/calendar-section';
import QnASection from '../section/qna-section';
import StudentTabSection from '../section/student-tab-section';
import { ConfirmParentRequestDialog } from './confirm-dialog';
import StudentOnboarding from './student-onboarding';

const DashboardStudent = ({
  initialMemberName,
}: {
  initialMemberName: string;
}) => {
  const memberEmail = useMemberStore((s) => s.member?.email);
  const [isParentRequestDialogOpen, setIsParentRequestDialogOpen] =
    useState(false);
  const { data: studyRooms = [] } = useStudentDashboardStudyRoomListQuery();
  const { hasRooms, hasNotes, hasAssignments, hasQuestions } =
    useOnboardingStatus({ rooms: studyRooms });
  const studentCompletionStatus = [
    hasRooms,
    hasNotes,
    hasAssignments,
    hasQuestions,
  ] as const;
  const studentStepsCompleted = studentCompletionStatus.every(Boolean);
  const query = {
    page: 0,
    size: 10,
    sort: 'regDate,DESC',
  };

  const { data: receivedData } = useReceivedConnectionList(query);
  const receivedParentRequest = useMemo(
    () =>
      receivedData?.connectionList.find(
        (connection) =>
          connection.state === 'PENDING' &&
          connection.recipientEmail === memberEmail
      ) ?? null,
    [memberEmail, receivedData?.connectionList]
  );

  useEffect(() => {
    if (!receivedParentRequest) return;

    setIsParentRequestDialogOpen(true);
  }, [receivedParentRequest]);

  return (
    <div className="flex w-full flex-col">
      <StudentDashboardHeader initialMemberName={initialMemberName} />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-25 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!studentStepsCompleted && (
          <StudentOnboarding completionStatus={studentCompletionStatus} />
        )}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <QnASection />
          <CalendarSection />
          <StudentTabSection studyRooms={studyRooms} />
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
