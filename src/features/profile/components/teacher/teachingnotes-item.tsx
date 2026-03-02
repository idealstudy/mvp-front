import { FrontendTeacherNoteListItem } from '@/entities/teacher';
import { SelectedListItem } from '@/features/profile/components/teacher/selected-list-item';
import StudyNoteVisibilityIcon from '@/features/study-notes/components/studynote-visibility-icon';
import { MiniSpinner } from '@/shared/components/loading';
import { ListItem } from '@/shared/components/ui/list-item';
import { getRelativeTimeString } from '@/shared/lib';

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
        rightSubTitle={`${getRelativeTimeString(teachingnote.modDate)} 수정`}
        href={`/study-rooms/${teachingnote.studyRoomId}/note/${teachingnote.id}`}
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
        rightSubTitle={
          isLoading ? '' : `${getRelativeTimeString(teachingnote.modDate)} 수정`
        }
        rightIcon={isLoading && <MiniSpinner />}
        checked={checked}
      />
    );
}
