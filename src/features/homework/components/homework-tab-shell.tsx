import { Role } from '@/entities/member';
import { StudyNoteSearch } from '@/features/study-notes/components/study-note-search';

type Props = {
  mode: Role | undefined;
  path: string;
  studyRoomId: number;
};

export const HomeworkTabShell = ({ mode, path, studyRoomId }: Props) => {
  return (
    <>
      {path === 'homework' && mode === 'ROLE_TEACHER' && (
        <StudyNoteSearch
          studyRoomId={studyRoomId}
          title="이번엔 어떤 과제를 생성하실 건가요?"
          placeholder="과제 제목을 입력해주세요."
          buttonText="과제 만들기"
          storageKey="study-homework-title"
          targetPath="homework/new"
          inputTestId="homework-create-title-input"
          buttonTestId="homework-create-button"
        />
      )}
      {path === 'homework' && mode === 'ROLE_STUDENT' && (
        <>
          <p className="font-headline1-heading whitespace-pre-wrap">
            {'제출해야할 과제를 확인해주세요!'}
          </p>
        </>
      )}
      {path === 'homework' && mode === 'ROLE_PARENT' && (
        <>
          <p className="font-headline1-heading whitespace-pre-wrap">
            {'내 아이의 과제 현황을 확인할 수 있어요!'}
          </p>
        </>
      )}
    </>
  );
};
