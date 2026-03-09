'use client';

import AddCareerDialog from '@/features/mypage/components/add-career-dialog';
import EditHighlightDialog from '@/features/mypage/components/edit-description-dialog';
import SelectTeachingnotesDialog from '@/features/mypage/components/select-teachingnotes-dialog';
import { useTeacherCareers } from '@/features/mypage/hooks/teacher/use-careers';
import { useTeacherDescription } from '@/features/mypage/hooks/teacher/use-description';
import { useTeacherReport } from '@/features/mypage/hooks/teacher/use-report';
import { useTeacherReviews } from '@/features/mypage/hooks/teacher/use-reviews';
import { useTeacherStudyRooms } from '@/features/mypage/hooks/teacher/use-study-rooms';
import { useTeacherRepresentativeTeachingNotes } from '@/features/mypage/hooks/teacher/use-teaching-notes';
import SectionContainer from '@/features/profile/components/section-container';
import ActivitySummarySection from '@/features/profile/components/teacher/activity-summary-section';
import CareerSection from '@/features/profile/components/teacher/career-section';
import DescriptionSection from '@/features/profile/components/teacher/description-section';
import ReviewSection from '@/features/profile/components/teacher/review-section';
import StudyroomSection from '@/features/profile/components/teacher/studyroom-section';
import StudynotesSection from '@/features/profile/components/teacher/teachingnotes-section';
import { useMemberStore } from '@/store';

export default function TeacherSections() {
  // 활동 통계
  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    refetch: refetchReport,
  } = useTeacherReport();

  // 특징
  const {
    data: description,
    isLoading: isDescriptionLoading,
    isFetching: isDescriptionFetching,
    isError: isDescriptionError,
    refetch: refetchDescription,
  } = useTeacherDescription();

  // 스터디룸
  const {
    data: studyRooms,
    isLoading: isStudyRoomsLoading,
    isError: isStudyRoomsError,
    refetch: refetchStudyRooms,
  } = useTeacherStudyRooms();

  // 리뷰
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useTeacherReviews({
    type: 'STUDYROOM_REVIEW',
    // 페이지네이션 고정
    page: 0,
    size: 5,
  });

  // 수업 노트
  const {
    data: teachingnotes,
    isLoading: isTeachingnotesLoading,
    isError: isTeachingnotesError,
    refetch: refetchTeachingnotes,
  } = useTeacherRepresentativeTeachingNotes();

  // 경력
  const {
    data: careers,
    isLoading: isCareersLoading,
    isError: isCareersError,
    refetch: refetchCareers,
  } = useTeacherCareers();

  // teacherId
  const teacherId = useMemberStore((state) => state.member?.id);

  return (
    <>
      <SectionContainer
        title="선생님 특징"
        isOwner
        action={<EditHighlightDialog description={description} />}
        isLoading={isDescriptionLoading || isDescriptionFetching}
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
        isOwner
        action={<AddCareerDialog />}
        isLoading={isCareersLoading}
        isError={isCareersError}
        onRetry={refetchCareers}
      >
        {careers && careers.length > 0 ? (
          <CareerSection
            careers={careers}
            isOwner
          />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            등록된 경력이 없습니다.
          </p>
        )}
      </SectionContainer>

      <SectionContainer
        title="대표 수업노트"
        isOwner
        action={<SelectTeachingnotesDialog />}
        isLoading={isTeachingnotesLoading}
        isError={isTeachingnotesError}
        onRetry={refetchTeachingnotes}
      >
        {/* 대표 수업노트가 없는 경우, 최신 수업노트 5개를 보여주므로 길이를 확인하지 않음 */}
        {teachingnotes && <StudynotesSection teachingnotes={teachingnotes} />}
      </SectionContainer>

      <SectionContainer
        title="운영중인 스터디룸"
        isLoading={isStudyRoomsLoading}
        isError={isStudyRoomsError}
        onRetry={refetchStudyRooms}
      >
        {studyRooms && teacherId && studyRooms.length ? (
          <StudyroomSection
            studyrooms={studyRooms}
            teacherId={teacherId}
          />
        ) : (
          <p className="text-text-sub2 my-4 text-center">
            운영중인 스터디룸이 없습니다.
          </p>
        )}
      </SectionContainer>
    </>
  );
}
