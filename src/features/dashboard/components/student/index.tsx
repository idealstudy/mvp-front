import { useMemo } from 'react';

import { useQnAsQuery } from '@/features/qna/services/query';
import { useStudentStudyRoomsQuery } from '@/features/study-rooms';

import { useOnboardingStatus } from '../../hooks/use-onboarding-status';
import DashboardHeader from '../header';
import QnASectionContent from '../section-content/qna-section-content';
import SingleSection from '../section/single-section';
import TabbedSection from '../section/tabbed-section';
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

  const studyRoomsList = useMemo(
    () => (studyRooms ?? []).map((room) => ({ id: room.id, name: room.name })),
    [studyRooms]
  );

  const firstStudyRoomId = studyRoomsList[0]?.id ?? 0;
  const { data: qnaList } = useQnAsQuery('ROLE_STUDENT', {
    studyRoomId: firstStudyRoomId,
    pageable: { page: 0, size: 4, sort: [] },
    enabled: firstStudyRoomId > 0,
  });

  const qnaContent = useMemo(
    () => (
      <QnASectionContent
        key="qna"
        isTeacher={false}
        questions={qnaList?.content ?? []}
        studyRoomId={firstStudyRoomId}
        studyRoomName={studyRoomsList[0]?.name ?? ''}
      />
    ),
    [qnaList?.content, firstStudyRoomId, studyRoomsList]
  );

  const mobileContent = useMemo(() => [<></>, qnaContent, <></>], [qnaContent]);
  const tabletContent = useMemo(() => [<></>, qnaContent], [qnaContent]);

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-100 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!studentStepsCompleted && <StudentOnboarding />}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <div className="tablet:gap-12 flex w-full flex-col gap-8">
            {/* 공통: 질문 섹션 */}
            <SingleSection title="제출하지 않은 과제">
              <></>
            </SingleSection>
            {/* tablet ~ desktop: 스터디룸 섹션 */}
            <SingleSection
              title="참여 중인 스터디룸"
              description="스터디룸에서 활동하며 공간을 채워가 보세요."
              className="tablet:flex hidden"
            >
              <></>
            </SingleSection>

            {/* mobile: 수업노트, 학생목록, 스터디룸 섹션 */}
            <TabbedSection
              title="필요한 정보들을 한눈에 확인해봐요"
              tabs={['수업노트', '질문목록', '스터디룸']}
              content={mobileContent}
              className="tablet:hidden"
            />
            {/* tablet ~ desktop: 수업노트, 학생목록, 스터디룸 섹션 */}
            <TabbedSection
              title="필요한 정보들을 한눈에 확인해봐요"
              tabs={['수업노트', '질문목록']}
              content={tabletContent}
              className="tablet:flex hidden"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardStudent;
