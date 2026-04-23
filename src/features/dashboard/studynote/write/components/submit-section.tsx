'use client';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';

type SubmitSectionProps = {
  isPending?: boolean;
  isEditMode?: boolean;
};

const SubmitSection = ({
  isPending,
  isEditMode = false,
}: SubmitSectionProps) => {
  const {
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();

  // 편집 모드일 때는 변경사항이 있을 때만 활성화
  const isButtonDisabled =
    !isValid || isPending || isSubmitting || (isEditMode && !isDirty);

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="submit"
        disabled={isButtonDisabled}
        className="w-[200px] rounded-sm"
        data-testid="note-submit-button"
      >
        {isPending ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
      </Button>

      {isEditMode && !isDirty && (
        <p className="text-text-sub2">변경사항이 없습니다.</p>
      )}
    </div>
  );
};

export default SubmitSection;
