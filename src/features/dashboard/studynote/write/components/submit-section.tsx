'use client';

import { Button } from '@/components/ui/button';

import { useWriteStudyNoteMutation } from '../services/query';

const SubmitSection = () => {
  const { isPending } = useWriteStudyNoteMutation();

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isPending}
        className="w-[200px] rounded-sm"
      >
        {isPending ? '저장 중...' : '저장하기'}
      </Button>
    </div>
  );
};

export default SubmitSection;
