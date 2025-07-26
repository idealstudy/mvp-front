'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { STUDY_NOTE_VISIBILITY } from '@/constants/value';

import { StudyNoteForm } from '../schemas/note';
import { useWriteStudyNoteMutation } from '../services/query';
import { StudyNoteVisibility } from '../type';

const SubmitSection = () => {
  const { handleSubmit } = useFormContext<StudyNoteForm>();
  const { mutate, isPending } = useWriteStudyNoteMutation();

  const onSubmit = async (data: StudyNoteForm) => {
    const parsingData = transformFormDataToServerFormat(data);
    mutate(parsingData);
  };

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
        className="w-[200px] rounded-sm"
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );
};

export default SubmitSection;

function transformVisibility(
  visibility: StudyNoteVisibility,
  isAddParent: boolean
): StudyNoteVisibility {
  const visibilityMap: Partial<
    Record<StudyNoteVisibility, StudyNoteVisibility>
  > = {
    [STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_AND_PARENTS,
    [STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_AND_PARENTS,
  };

  return isAddParent && visibilityMap[visibility]
    ? visibilityMap[visibility]
    : visibility;
}

function transformFormDataToServerFormat(formData: StudyNoteForm) {
  const isAddParent = formData.isAddParent ?? false;

  return {
    studyRoomId: formData.studyRoomId,
    title: formData.title,
    content: JSON.stringify(formData.content),
    visibility: transformVisibility(
      formData.visibility as StudyNoteVisibility,
      isAddParent
    ),
    taughtAt: new Date(formData.taughtAt).toISOString(),
    studentIds: formData.studentIds.map((student) => student.id),
  };
}
