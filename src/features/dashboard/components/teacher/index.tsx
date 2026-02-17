import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { useTeacherOnboardingQuery } from '@/features/dashboard/hooks/use-onboarding-query';
import { useTeacherStudyRoomsQuery } from '@/features/study-rooms';
import { PRIVATE } from '@/shared/constants';

import { useDashboardQuery } from '../../hooks';
import DashboardHeader from '../header';
import NoteSectionContent from '../section-content/note-section-content';
import QnASectionContent from '../section-content/qna-section-content';
import StudentsSectionContent from '../section-content/student-section-content';
import StudyroomSectionContent from '../section-content/studyroom-section-content';
import SingleSection from '../section/single-section';
import TabbedSection from '../section/tabbed-section';
import Onboarding from './onboarding';

const DashboardTeacher = () => {
  const router = useRouter();
  const { data: teacherOnboarding } = useTeacherOnboardingQuery();
  const { data: dashboard } = useDashboardQuery();
  const { data: studyRooms } = useTeacherStudyRoomsQuery();

  // 스터디룸 여부
  const hasStudyRooms = !!(studyRooms && studyRooms.length > 0);

  // 데이터 목록 - API 제공 후에 삭제합니다.
  const notes = useMemo(
    () =>
      (dashboard?.notes ?? []).map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        studyRoomId: note.studyRoomId,
        studyRoomName:
          studyRooms?.find((room) => room.id === note.studyRoomId)?.name ?? '',
      })),
    [dashboard?.notes, studyRooms]
  );

  const studyRoomsList = useMemo(
    () => (studyRooms ?? []).map((room) => ({ id: room.id, name: room.name })),
    [studyRooms]
  );

  // 페이지 이동 함수
  const handleStudyRoomClick = useCallback(
    (studyRoomId: number) => {
      router.push(PRIVATE.ROOM.DETAIL(studyRoomId));
    },
    [router]
  );
  const handleNoteClick = useCallback(
    (studyRoomId: number, noteId: number) => {
      router.push(PRIVATE.NOTE.DETAIL(studyRoomId, noteId));
    },
    [router]
  );
  const handleNewNoteClick = useCallback(() => {
    const studyRoomId = studyRoomsList[0]?.id ?? 0;
    if (studyRoomId === 0) return;
    router.push(PRIVATE.NOTE.CREATE(studyRoomId));
  }, [router, studyRoomsList]);

  // 섹션 내부 콘텐츠 컴포넌트 정의
  const noteContent = useMemo(
    () => (
      <NoteSectionContent
        key="note"
        hasStudyRooms={hasStudyRooms}
        notes={notes}
        onClickNewNote={handleNewNoteClick}
        onClickNote={handleNoteClick}
      />
    ),
    [hasStudyRooms, notes, handleNewNoteClick, handleNoteClick]
  );

  const studentsContent = useMemo(
    () => <StudentsSectionContent key="students" />,
    []
  );

  const studyroomContent = useMemo(
    () => (
      <StudyroomSectionContent
        key="studyrooms"
        studyRooms={studyRoomsList ?? []}
        onStudyRoomClick={handleStudyRoomClick}
      />
    ),
    [studyRoomsList, handleStudyRoomClick]
  );

  const mobileContent = useMemo(
    () => [noteContent, studentsContent, studyroomContent],
    [noteContent, studentsContent, studyroomContent]
  );

  const tabletContent = useMemo(
    () => [noteContent, studentsContent],
    [noteContent, studentsContent]
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <main className="tablet:gap-12 desktop:gap-20 bg-gray-white tablet:py-12 desktop:pb-100 tablet:px-20 relative flex w-full flex-col gap-8 px-4.5 py-8">
        {!teacherOnboarding?.isCompleted && <Onboarding />}
        <div className="tablet:gap-25 flex w-full flex-col gap-8">
          <div className="tablet:gap-12 flex w-full flex-col gap-8">
            {/* 공통: 질문 섹션 */}
            <SingleSection
              title="답변이 필요한 질문"
              description="아직 답변하지 않은 질문만 추렸어요."
            >
              <QnASectionContent />
            </SingleSection>
            {/* tablet ~ desktop: 스터디룸 섹션 */}
            <SingleSection
              title="나의 스터디룸"
              description="과제가 쌓일수록 바뀌는 스터디룸으로 진행 상황을 확인해보세요."
              className="tablet:flex hidden"
            >
              {studyroomContent}
            </SingleSection>

            {/* mobile: 수업노트, 학생목록, 스터디룸 섹션 */}
            <TabbedSection
              title="필요한 정보들을 한눈에 확인해봐요"
              tabs={['수업노트', '학생목록', '스터디룸']}
              content={mobileContent}
              className="tablet:hidden"
            />
            {/* tablet ~ desktop: 수업노트, 학생목록, 스터디룸 섹션 */}
            <TabbedSection
              title="필요한 정보들을 한눈에 확인해봐요"
              tabs={['수업노트', '학생목록']}
              content={tabletContent}
              className="tablet:flex hidden"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardTeacher;
