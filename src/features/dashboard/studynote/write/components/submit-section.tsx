'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { STUDY_NOTE_VISIBILITY } from '@/constants/value';

import { StudyNoteForm } from '../schemas/note';
import { StudyNoteVisibility } from '../type';

export function transformVisibility(
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

const SubmitSection = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<StudyNoteForm>();

  const onSubmit = async (data: StudyNoteForm) => {
    const serverData = transformFormDataToServerFormat(data);

    return serverData;
    // console.log('원본 폼 데이터:', data);
    // console.log('서버로 전송할 데이터:', serverData);

    // await api.post('/notes', serverData);
  };

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="w-[200px] rounded-sm"
      >
        {isSubmitting ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );
};

export default SubmitSection;
