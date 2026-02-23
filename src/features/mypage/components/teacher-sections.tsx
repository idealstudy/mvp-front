import { useTeacherReport } from '@/features/mypage/hooks/teacher/use-report';
import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';
import ActivitySummarySection from '@/features/profile/components/teacher/activity-summary-section';
import SelectStudynotesDialog from '@/features/profile/components/teacher/select-studynotes-dialog';
import { MiniSpinner } from '@/shared/components/loading';

export default function TeacherSections() {
  const {
    data: report,
    isLoading: isReportLoading,
    error: isReportError,
  } = useTeacherReport();

  // TODO: loading에 skeleton 적용
  const renderActivitySummary = () => {
    if (isReportLoading) return <MiniSpinner />;
    if (isReportError || !report) return <ComingSoonSection />;
    return <ActivitySummarySection summary={report} />;
  };

  return (
    <>
      <SectionContainer title="활동 요약">
        {renderActivitySummary()}
      </SectionContainer>

      <SectionContainer title="후기">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="경력">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer
        title="대표 수업노트"
        action={<SelectStudynotesDialog />}
      >
        <ComingSoonSection />
        {/* <StudynotesSection profile={profile} /> */}
      </SectionContainer>

      <SectionContainer title="운영중인 스터디룸">
        <ComingSoonSection />
        {/* <StudyroomSection profile={profile} /> */}
      </SectionContainer>
    </>
  );
}
