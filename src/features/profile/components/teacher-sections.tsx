import SectionContainer from '@/features/profile/components/section-container';
import ActivitySummarySection from '@/features/profile/components/teacher/activity-summary-section';
import CareerSection from '@/features/profile/components/teacher/career-section';
import DescriptionSection from '@/features/profile/components/teacher/description-section';
import ReviewSection from '@/features/profile/components/teacher/review-section';
import StudyroomSection from '@/features/profile/components/teacher/studyroom-section';
import StudynotesSection from '@/features/profile/components/teacher/teachingnotes-section';
import { useProfileCareers } from '@/features/profile/hooks/use-profile-careers';
import { useProfileDescription } from '@/features/profile/hooks/use-profile-description';
import { useProfileReport } from '@/features/profile/hooks/use-profile-report';
import { useProfileReviews } from '@/features/profile/hooks/use-profile-reviews';
import { useProfileStudyRooms } from '@/features/profile/hooks/use-profile-study-rooms';
import { useProfileTeachingNotes } from '@/features/profile/hooks/use-profile-teaching-notes';

export default function TeacherSections({ teacherId }: { teacherId: number }) {
  // 특징
  const {
    data: description,
    isLoading: isDescriptionLoading,
    isError: isDescriptionError,
    refetch: refetchDescription,
  } = useProfileDescription(teacherId);

  // 활동 통계
  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    refetch: refetchReport,
  } = useProfileReport(teacherId);

  // 리뷰
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useProfileReviews(teacherId);

  // 경력
  const {
    data: careers,
    isLoading: isCareersLoading,
    isError: isCareersError,
    refetch: refetchCareers,
  } = useProfileCareers(teacherId);

  // 수업 노트
  const {
    data: teachingnotes,
    isLoading: isTeachingnotesLoading,
    isError: isTeachingnotesError,
    refetch: refetchTeachingnotes,
  } = useProfileTeachingNotes(teacherId);

  // 스터디룸
  const {
    data: studyRooms,
    isLoading: isStudyRoomsLoading,
    isError: isStudyRoomsError,
    refetch: refetchStudyRooms,
  } = useProfileStudyRooms(teacherId);

  return (
    <>
      <SectionContainer
        title="선생님의 특징"
        isLoading={isDescriptionLoading}
        isError={isDescriptionError}
        onRetry={refetchDescription}
      >
        {description?.resolvedDescription.content ? (
          <DescriptionSection description={description} />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            등록된 선생님 특징이 없습니다.
          </p>
        )}
      </SectionContainer>

      <SectionContainer
        title="활동 요약"
        isLoading={isReportLoading}
        isError={isReportError}
        onRetry={refetchReport}
      >
        {report && <ActivitySummarySection summary={report} />}
      </SectionContainer>

      <SectionContainer
        title="후기"
        isLoading={isReviewsLoading}
        isError={isReviewsError}
        onRetry={refetchReviews}
      >
        {reviews && reviews.content.length > 0 ? (
          <ReviewSection reviews={reviews} />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            작성된 후기가 없습니다.
          </p>
        )}
      </SectionContainer>

      <SectionContainer
        title="경력"
        isLoading={isCareersLoading}
        isError={isCareersError}
        onRetry={refetchCareers}
      >
        {careers && careers.length > 0 ? (
          <CareerSection careers={careers} />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            등록된 경력이 없습니다.
          </p>
        )}
      </SectionContainer>

      <SectionContainer
        title="대표 수업노트"
        isLoading={isTeachingnotesLoading}
        isError={isTeachingnotesError}
        onRetry={refetchTeachingnotes}
      >
        {teachingnotes && teachingnotes.length ? (
          <StudynotesSection teachingnotes={teachingnotes} />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            대표 수업노트가 없습니다.
          </p>
        )}
      </SectionContainer>

      <SectionContainer
        title="운영중인 스터디룸"
        isLoading={isStudyRoomsLoading}
        isError={isStudyRoomsError}
        onRetry={refetchStudyRooms}
      >
        {studyRooms && studyRooms.length ? (
          <StudyroomSection studyrooms={studyRooms} />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            운영중인 스터디룸이 없습니다.
          </p>
        )}
      </SectionContainer>
    </>
  );
}
