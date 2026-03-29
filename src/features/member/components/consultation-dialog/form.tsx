'use client';

import { useState } from 'react';

import {
  TextEditor,
  initialTextEditorValue,
  prepareContentForSave,
} from '@/shared/components/editor';
import { TextEditorValue } from '@/shared/components/editor/types';
import { Button } from '@/shared/components/ui/button';

import { ConsultationDialogLayout, ConsultationTabNav } from '.';

type Props = {
  studentId: string;
  studentName: string;
  isOpen: boolean;
  isTeacher: boolean;
  onClose: () => void;
  onTabChange: (tab: 'write' | 'list') => void;
  onSave: (contentString: string, mediaIds: string[]) => void;
};

export const ConsultationForm = ({
  studentName,
  isOpen,
  isTeacher,
  onClose,
  onTabChange,
  onSave,
}: Props) => {
  const [content, setContent] = useState<TextEditorValue>(
    initialTextEditorValue
  );

  const handleSave = () => {
    const { contentString, mediaIds } = prepareContentForSave(content);
    onSave(contentString, mediaIds);
    setContent(initialTextEditorValue);
  };

  return (
    <ConsultationDialogLayout
      isOpen={isOpen}
      onClose={onClose}
      title={`${studentName} 학생 기록 일지`}
      navigation={
        isTeacher ? (
          <ConsultationTabNav
            activeTab="write"
            onTabChange={onTabChange}
          />
        ) : undefined
      }
      footer={
        isTeacher ? (
          <Button
            variant="primary"
            size="small"
            className="font-body2-heading px-12"
            onClick={handleSave}
          >
            저장
          </Button>
        ) : undefined
      }
    >
      <p className="font-body2-heading text-gray-12 mb-3">
        기록 일지를 작성해주세요
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
