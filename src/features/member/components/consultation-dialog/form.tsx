'use client';

import { TextEditor } from '@/shared/components/editor';
import { TextEditorValue } from '@/shared/components/editor/types';

type Props = {
  content: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
};

export const ConsultationFormContent = ({ content, onChange }: Props) => {
  return (
    <>
      <p className="font-body2-heading text-gray-12 mb-3">
        기록 일지를 작성해주세요
      </p>
      <div className="flex-1">
        <TextEditor
          value={content}
          onChange={onChange}
          placeholder="학생의 특징이나 특이사항을 입력해주세요"
          targetType="TEACHING_NOTE"
          minHeight="220px"
          maxHeight="220px"
        />
      </div>
    </>
  );
};
