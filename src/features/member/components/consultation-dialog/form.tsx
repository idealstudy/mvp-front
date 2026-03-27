'use client';

import { useState } from 'react';

import { TextEditor, initialTextEditorValue } from '@/shared/components/editor';
import { TextEditorValue } from '@/shared/components/editor/types';
import { Button } from '@/shared/components/ui/button';

import { ConsultationDialogLayout, ConsultationTabNav } from '.';

type Props = {
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: 'write' | 'list') => void;
  onSave: (content: TextEditorValue) => void;
};

export const ConsultationForm = ({
  studentName,
  isOpen,
  onClose,
  onTabChange,
  onSave,
}: Props) => {
  const [content, setContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );

  const handleSave = () => {
    onSave(content);
    setContent(initialTextEditorValue);
  };

  return (
    <ConsultationDialogLayout
      isOpen={isOpen}
      onClose={onClose}
      title={`${studentName} 학생 상담서`}
      navigation={
        <ConsultationTabNav
          activeTab="write"
          onTabChange={onTabChange}
        />
      }
      footer={
        <Button
          variant="primary"
          size="small"
          onClick={handleSave}
        >
          저장
        </Button>
      }
    >
      <p className="font-body2-heading text-gray-12 mb-3">
        기록할 상담서를 작성해주세요
      </p>
      <div className="flex-1">
        <TextEditor
          value={content}
          onChange={setContent}
          placeholder="학생의 특징이나 특이사항을 입력해주세요"
          targetType="TEACHING_NOTE"
          minHeight="220px"
          maxHeight="220px"
        />
      </div>
    </ConsultationDialogLayout>
  );
};
