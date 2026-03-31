import { FrontendTeacherRepresentativeNoteList } from '@/entities/teacher';
import TeachingNoteItem from '@/features/profile/components/teacher/teaching-note-item';

export default function TeachingNoteSection({
  teachingnotes,
}: {
  teachingnotes: FrontendTeacherRepresentativeNoteList;
}) {
  return (
    <>
      {teachingnotes.map((teachingnote) => (
        <TeachingNoteItem
          key={teachingnote.id}
          variant="link"
          teachingnote={teachingnote}
        />
      ))}
    </>
  );
}
