import SectionContainer from '@/features/profile/components/section-container';
import ActivityReportSection from '@/features/profile/components/student/activity-report-section';
import StudyroomSection from '@/features/profile/components/student/studyroom-section';
import { useStudentProfileReport } from '@/features/profile/hooks/student/use-profile-report';
import { useStudentProfileStudyRooms } from '@/features/profile/hooks/student/use-profile-study-rooms';

export default function StudentSections({ studentId }: { studentId: number }) {
  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    refetch: refetchReport,
  } = useStudentProfileReport(studentId);

  const {
    data: studyRooms,
    isLoading: isStudyRoomsLoading,
    isError: isStudyRoomsError,
    refetch: refetchStudyRooms,
  } = useStudentProfileStudyRooms(studentId);

  return (
    <>
      <SectionContainer
        title="누적 활동 리포트"
        isLoading={isReportLoading}
        isError={isReportError}
        onRetry={refetchReport}
      >
        {report && <ActivityReportSection report={report} />}
      </SectionContainer>

      <SectionContainer
        title="참여한 스터디룸"
        isLoading={isStudyRoomsLoading}
        isError={isStudyRoomsError}
        onRetry={refetchStudyRooms}
      >
        {studyRooms && studyRooms.length ? (
          <StudyroomSection
            data={studyRooms}
            readonly
          />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            참여한 스터디룸이 없습니다.
          </p>
        )}
      </SectionContainer>
    </>
  );
}
