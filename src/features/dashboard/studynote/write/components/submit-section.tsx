'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { StudyNoteForm } from '../schemas/note';
import { useWriteStudyNoteMutation } from '../services/query';

const SubmitSection = () => {
  const { isPending } = useWriteStudyNoteMutation();
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext<StudyNoteForm>();

  const isButtonDisabled = !isValid || isPending || isSubmitting;

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isButtonDisabled}
        className="w-[200px] rounded-sm"
      >
        저장하기
      </Button>
    </div>
  );
};

export default SubmitSection;
