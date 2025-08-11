'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { StudyNoteForm, studyNoteFormSchema } from '../schemas/note';

export const RequiredMark = () => {
  return <span className="text-key-color-primary"> *</span>;
};

const StudyNoteFormProvider = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<StudyNoteForm>({
    resolver: zodResolver(studyNoteFormSchema),
    defaultValues: {
      title: '',
      content: {},
      studentIds: [],
      studyRoomId: undefined,
      taughtAt: new Date().toISOString().split('T')[0],
    },
    mode: 'onChange',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default StudyNoteFormProvider;
