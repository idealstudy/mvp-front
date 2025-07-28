'use client';

import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { ROUTE } from '@/constants/route';

import { STUDY_NOTE_VISIBILITY } from '../../constant';
import { StudyNoteForm } from '../schemas/note';
import { useWriteStudyNoteMutation } from '../services/query';
import { StudyNoteVisibility } from '../type';

const WriteForm = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const { mutate } = useWriteStudyNoteMutation();
  const { handleSubmit } = useFormContext<StudyNoteForm>();

  const onSubmit = (data: StudyNoteForm) => {
    const parsingData = transformFormDataToServerFormat(data);
    mutate(parsingData, {
      onSuccess: () => {
        router.replace(ROUTE.DASHBOARD.HOME);
      },
    });
  };

  return <Form onSubmit={handleSubmit(onSubmit)}>{children}</Form>;
};

export default WriteForm;

function transformVisibility(
  visibility: StudyNoteVisibility,
  isGuardianVisible: boolean
): StudyNoteVisibility {
  const visibilityMap: Partial<
    Record<StudyNoteVisibility, StudyNoteVisibility>
  > = {
    [STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.SPECIFIC_STUDENTS_AND_PARENTS,
    [STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_ONLY]:
      STUDY_NOTE_VISIBILITY.STUDY_ROOM_STUDENTS_AND_PARENTS,
  };

  return isGuardianVisible && visibilityMap[visibility]
    ? visibilityMap[visibility]
    : visibility;
}

function transformFormDataToServerFormat(formData: StudyNoteForm) {
  const isGuardianVisible = formData.isGuardianVisible ?? false;

  return {
    studyRoomId: formData.studyRoomId,
    title: formData.title,
    content: JSON.stringify(formData.content),
    visibility: transformVisibility(
      formData.visibility as StudyNoteVisibility,
      isGuardianVisible
    ),
    taughtAt: new Date(formData.taughtAt).toISOString(),
    studentIds: formData.studentIds.map((student) => student.id),
  };
}
