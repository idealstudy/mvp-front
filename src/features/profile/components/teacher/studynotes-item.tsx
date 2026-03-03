import { SelectedListItem } from '@/features/profile/components/teacher/selected-list-item';
import StudyNoteVisibilityIcon from '@/features/study-notes/components/studynote-visibility-icon';
import { StudyNote } from '@/features/study-notes/model';
import { ListItem } from '@/shared/components/ui/list-item';
import { getRelativeTimeString } from '@/shared/lib';

type LinkVariant = {
  variant: 'link';
  onClick?: never;
  checked?: never;
};

type SelectableVariant = {
  variant: 'selectable';
  onClick: () => void;
  checked?: boolean;
};

type StudynotesItemProps = {
  studynote: StudyNote;
} & (LinkVariant | SelectableVariant);

export default function StudynotesItem({
  studynote,
  variant,
  onClick,
  checked,
}: StudynotesItemProps) {
  if (variant === 'link')
    return (
      <ListItem
        title={studynote.title}
        tag={
          studynote.groupId && (
            <p className="text-gray-scale-gray-60 bg-gray-scale-gray-5 flex h-5 items-center justify-center rounded-[4px] p-1 text-[10px]">
              {studynote.groupName}
            </p>
          )
        }
        icon={<StudyNoteVisibilityIcon visibility={studynote.visibility} />}
        subtitle={
          studynote.updatedAt === studynote.taughtAt
            ? `${getRelativeTimeString(studynote.taughtAt)} 작성`
            : `${getRelativeTimeString(studynote.updatedAt)} 수정`
        }
        // href={`/study-rooms/1/note/${studynote.id}`}
        href="#"
        id={studynote.id}
      />
    );

  if (variant === 'selectable')
    return (
      <SelectedListItem
        title={studynote.title}
        onClick={onClick}
        tag={
          studynote.groupId && (
            <p className="text-gray-scale-gray-60 bg-gray-scale-gray-5 flex h-5 items-center justify-center rounded-[4px] p-1 text-[10px]">
              {studynote.groupName}
            </p>
          )
        }
        icon={<StudyNoteVisibilityIcon visibility={studynote.visibility} />}
        subtitle={
          studynote.updatedAt === studynote.taughtAt
            ? `${getRelativeTimeString(studynote.taughtAt)} 작성`
            : `${getRelativeTimeString(studynote.updatedAt)} 수정`
        }
        checked={checked}
      />
    );
}
