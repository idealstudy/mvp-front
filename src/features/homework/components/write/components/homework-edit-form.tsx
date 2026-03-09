'use client';

import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useTeacherUpdateHomework } from '@/features/homework/hooks/teacher/useTeacherHomeworkMutations';
import { prepareContentForSave } from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';

import { HomeworkForm } from '../schemas/note';

type EditFormProps = {
  homeworkId: number;
  studyRoomId: number;
};

const HomeworkEditForm = ({
  children,
  homeworkId,
  studyRoomId,
}: PropsWithChildren<EditFormProps>) => {
  const router = useRouter();
  const { mutate: updateHomework } = useTeacherUpdateHomework();
  const { handleSubmit, setError } = useFormContext<HomeworkForm>();

  const onSubmit = (data: HomeworkForm) => {
    const parsingData = transformFormDataToServerFormat(data);

    updateHomework(
      {
        studyRoomId,
        homeworkId,
        body: {
          title: parsingData.title,
          content: parsingData.content,
          deadline: parsingData.deadline,
          reminderOffsets: parsingData.reminderOffsets,
          teachingNoteIds: parsingData.teachingNoteIds,
          studentIds: parsingData.studentIds,
          mediaIds: parsingData.mediaIds,
        },
      },
      {
        onSuccess: () => {
          router.replace(`/study-rooms/${studyRoomId}/homework/${homeworkId}`);
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onField: (msg) => {
              setError('root', { message: msg });
            },

            onContext: () => {
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/homework`);
              }, 1500);
            },

            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },

            onUnknown: () => {},
          });
        },
      }
    );
  };

  return <Form onSubmit={handleSubmit(onSubmit)}>{children}</Form>;
};

function transformFormDataToServerFormat(formData: HomeworkForm) {
  const { contentString, mediaIds } = prepareContentForSave(formData.content);

  return {
    title: formData.title,
    content: contentString,
    deadline: formData.deadline,
    reminderOffsets: formData.reminderOffsets ?? [],
    teachingNoteIds: formData.teachingNoteIds ?? [],
    studentIds: formData.studentIds?.map((s) => s.id) ?? [],
    mediaIds,
  };
}

export default HomeworkEditForm;
