'use client';

import { PropsWithChildren } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import type { TeacherHomeworkRequest } from '@/entities/homework/types';
import { useUpdateTeacherOnboarding } from '@/features/dashboard/hooks/use-update-onboarding';
import { useTeacherCreateHomework } from '@/features/homework/hooks/teacher/useTeacherHomeworkMutations';
import { prepareContentForSave } from '@/shared/components/editor';
import { Form } from '@/shared/components/ui/form';
import { PRIVATE } from '@/shared/constants';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';

import { HomeworkForm } from '../schemas/note';

// homework
export const HomeworkWriteForm = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const studyRoomId = useWatch({ name: 'studyRoomId' });

  const { mutate } = useTeacherCreateHomework();
  const { handleSubmit, setError } = useFormContext<HomeworkForm>();
  const { sendOnboarding } = useUpdateTeacherOnboarding('ASSIGN_ASSIGNMENT');

  const onSubmit = (data: HomeworkForm) => {
    const parsingData = transformHomeworkFormToServerFormat(data);

    mutate(
      {
        studyRoomId,
        body: parsingData,
      },
      {
        onSuccess: () => {
          router.replace(PRIVATE.HOMEWORK.LIST(studyRoomId));
          // 온보딩 반영
          sendOnboarding();
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onField: (msg) => {
              setError('root', { message: msg });
            },

            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },

            onContext: () => {
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/homework`);
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

function transformHomeworkFormToServerFormat(
  formData: HomeworkForm
): TeacherHomeworkRequest {
  const { contentString, mediaIds } = prepareContentForSave(formData.content);

  return {
    title: formData.title,
    content: contentString,
    deadline: normalizeDeadline(formData.deadline),
    studentIds: formData.studentIds?.map((s) => s.id),
    reminderOffsets: formData.reminderOffsets ?? undefined,
    teachingNoteIds: formData.teachingNoteIds ?? [],
    mediaIds,
  };
}

function normalizeDeadline(value: string) {
  // "2026-02-01T08:50" → "2026-02-01T08:50:00"
  return value.length === 16 ? `${value}:00` : value;
}
