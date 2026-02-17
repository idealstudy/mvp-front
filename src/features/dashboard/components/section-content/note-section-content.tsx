import { AddNoteIcon } from '@/shared/components/icons';

interface NoteSectionContentProps {
  notes: {
    id: number;
    title: string;
    content: string;
    studyRoomId: number;
    studyRoomName: string;
  }[];
  hasStudyRooms: boolean;
  // isMore?: boolean;
  onClickNewNote: () => void;
  onClickNote: (studyRoomId: number, noteId: number) => void;
  // onClickMore?: () => void;
}
const NoteSectionContent = ({
  notes,
  hasStudyRooms,
  // isMore = false,
  onClickNewNote,
  onClickNote,
  // onClickMore = () => {},
}: NoteSectionContentProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {!hasStudyRooms && (
        <p className="font-body2-normal text-gray-8">
          상단을 참고해 스터디룸을 생성하고 학생을 초대한 후, 이용할 수 있어요.
        </p>
      )}

      {/* 추가하기 버튼 */}
      {hasStudyRooms && (
        <button
          type="button"
          className="bg-gray-1 text-gray-7 border-gray-3 flex w-full items-center justify-center gap-1 rounded-lg border-1 px-8 py-3"
          onClick={onClickNewNote}
        >
          <AddNoteIcon
            className="h-6 w-6 shrink-0"
            aria-hidden
          />
          <span className="font-body2-normal">추가하기</span>
        </button>
      )}

      {/* 노트 목록 */}
      {notes.map((note) => (
        <button
          key={note.id}
          type="button"
          className="bg-orange-1 border-orange-3 flex w-full cursor-pointer flex-col items-start gap-1 rounded-lg border px-7 py-7 text-left"
          onClick={() => onClickNote(note.studyRoomId, note.id)}
        >
          <span className="font-label-heading text-orange-7">
            {note.studyRoomName}
          </span>
          <span className="font-body1-heading text-gray-12 mb-2 line-clamp-2 leading-tight">
            {note.title}
          </span>
          <span className="font-body2-normal text-gray-12 line-clamp-2 leading-tight">
            {note.content}
          </span>
        </button>
      ))}

      {/* 더보기 버튼: 이동할 페이지가 없어 주석처리 */}
      {/* {isMore && (
        <button
          type="button"
          className="w-full flex items-center justify-center py-3 px-8 rounded-lg bg-gray-white text-gray-12 border-gray-5 border-1"
          onClick={onClickMore}
        >
          <span className="font-body2-normal text-gray-12">더보기</span>
        </button>
      )} */}
    </div>
  );
};

export default NoteSectionContent;
