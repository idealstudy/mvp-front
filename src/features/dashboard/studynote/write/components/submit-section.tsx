'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { StudyNoteForm } from '../schemas/note';

const SubmitSection = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<StudyNoteForm>();

  const onSubmit = async () => {};

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
