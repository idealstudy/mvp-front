import { FrontendTeacherNoteListItem } from '@/entities/teacher';
import { SelectedListItem } from '@/features/profile/components/teacher/selected-list-item';
import StudyNoteVisibilityIcon from '@/features/study-notes/components/studynote-visibility-icon';
import { MiniSpinner } from '@/shared/components/loading';
import { ListItem } from '@/shared/components/ui/list-item';

type LinkVariant = {
  variant: 'link';
  onClick?: never;
  checked?: never;
  isLoading?: never;
};

type SelectableVariant = {
  variant: 'selectable';
  onClick: () => void;
  checked?: boolean;
  isLoading?: boolean;
};

type TeachingnotesItemProps = {
  teachingnote: FrontendTeacherNoteListItem;
} & (LinkVariant | SelectableVariant);

export default function TeachingnotesItem({
  teachingnote,
  variant,
  onClick,
  checked,
  isLoading,
}: TeachingnotesItemProps) {
  if (variant === 'link')
    return (
      <ListItem
        title={teachingnote.name}
        icon={<StudyNoteVisibilityIcon visibility="PUBLIC" />}
        subtitle={`조회수 ${teachingnote.viewCount}명 | 질문수 ${teachingnote.qnaCount}개`}
        href={`/study-rooms/${teachingnote.studyRoomId}/note/${teachingnote.id}`}
        tag={
          <span className="bg-gray-2 font-caption-normal text-gray-8 mb-1 rounded-sm px-1 py-0.5">
            {teachingnote.studyRoomName}
          </span>
        }
        id={teachingnote.id}
      />
    );

  if (variant === 'selectable')
    return (
      <SelectedListItem
        title={teachingnote.name}
        onClick={onClick}
        icon={<StudyNoteVisibilityIcon visibility="PUBLIC" />}
        subtitle={`조회수 ${teachingnote.viewCount}명 | 질문수 ${teachingnote.qnaCount}개`}
        rightSubTitle={isLoading ? '' : teachingnote.studyRoomName}
        rightIcon={isLoading && <MiniSpinner />}
        checked={checked}
      />
    );
}
