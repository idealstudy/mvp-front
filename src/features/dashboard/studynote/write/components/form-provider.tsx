'use client';

import { FormProvider, useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

import { StudyNoteForm, StudyNoteSchema } from '../schemas/note';

export const RequiredMark = () => {
  return <span className="text-key-color-primary"> *</span>;
};

const StudyNoteFormProvider = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<StudyNoteForm>({
    resolver: zodResolver(StudyNoteSchema),
    defaultValues: {
      title: '',
      content: {},
      studentIds: [],
      studyRoomId: undefined,
      taughtAt: new Date().toISOString().split('T')[0],
      visibility: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <Form>{children}</Form>
    </FormProvider>
  );
};

export default StudyNoteFormProvider;
