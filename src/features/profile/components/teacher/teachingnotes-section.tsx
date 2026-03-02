import { FrontendTeacherRepresentativeNoteList } from '@/entities/teacher';
import TeachingnotesItem from '@/features/profile/components/teacher/teachingnotes-item';

export default function StudynotesSection({
  teachingnotes,
}: {
  teachingnotes: FrontendTeacherRepresentativeNoteList;
}) {
  return (
    <>
      {teachingnotes.map((teachingnote) => (
        <TeachingnotesItem
          key={teachingnote.id}
          variant="link"
          teachingnote={teachingnote}
        />
      ))}
    </>
  );
}
