'use client';

import { useStudentHomeworks } from '@/features/mypage/profile/hooks/student/use-homeworks';
import { useStudentReport } from '@/features/mypage/profile/hooks/student/use-report';
import ComingSoonSection from '@/features/profile/components/coming-soon-section';
import SectionContainer from '@/features/profile/components/section-container';
import ActivityReportSection from '@/features/profile/components/student/activity-report-section';
import HomeworkSection from '@/features/profile/components/student/homework-section';

export default function StudentSections() {
  // 누적 활동
  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    refetch: refetchReport,
  } = useStudentReport();

  // 과제
  const {
    data: homeworkData,
    isLoading: isHomeworkLoading,
    isError: isHomeworkError,
    refetch: refetchHomework,
    page: homeworkPage,
    setPage: setHomeworkPage,
    keyword: homeworkKeyword,
    setKeyword: setHomeworkKeyword,
    sortKey: homeworkSortKey,
    setSortKey: setHomeworkSortKey,
    isExpanded: isHomeworkExpanded,
    setIsExpanded: setIsHomeworkExpanded,
  } = useStudentHomeworks();

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
        title="내 과제"
        isLoading={isHomeworkLoading}
        isError={isHomeworkError}
        onRetry={refetchHomework}
      >
        <HomeworkSection
          data={homeworkData}
          page={homeworkPage}
          setPage={setHomeworkPage}
          keyword={homeworkKeyword}
          setKeyword={setHomeworkKeyword}
          sortKey={homeworkSortKey}
          setSortKey={setHomeworkSortKey}
          isExpanded={isHomeworkExpanded}
          setIsExpanded={setIsHomeworkExpanded}
        />
      </SectionContainer>

      <SectionContainer title="내 질문">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="최근 등록된 수업노트">
        <ComingSoonSection />
      </SectionContainer>

      <SectionContainer title="참여한 스터디룸">
        <ComingSoonSection />
      </SectionContainer>
    </>
  );
}
