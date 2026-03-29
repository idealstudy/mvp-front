'use client';

import { useState } from 'react';

import {
  TextEditor,
  TextViewer,
  prepareContentForSave,
} from '@/shared/components/editor';
import { TextEditorValue } from '@/shared/components/editor/types';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import { ConsultationDialogLayout } from '.';
import { DeleteConfirm } from './delete-confirm';

type Props = {
  isOpen: boolean;
  isTeacher: boolean;
  onClose: () => void;
  onBack: () => void;
  date: string;
  initialContent: TextEditorValue;
  onSave: (contentString: string, mediaIds: string[]) => void;
  onDelete: () => void;
};

export const ConsultationDetail = ({
  isOpen,
  isTeacher,
  onClose,
  onBack,
  date,
  initialContent,
  onSave,
  onDelete,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [content, setContent] = useState<TextEditorValue>(initialContent);

  const handleSave = () => {
    const { contentString, mediaIds } = prepareContentForSave(content);
    onSave(contentString, mediaIds);
  };

  const handleCancel = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  return (
    <>
      <ConsultationDialogLayout
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={isEditing ? handleCancel : onBack}
              className="text-gray-7 hover:text-gray-12 -ml-1 shrink-0 p-1"
              aria-label={isEditing ? '편집 취소' : '목록으로'}
            >
              <ChevronLeft
                size={20}
                aria-hidden
              />
            </button>
            <span className="truncate">{date} 기록 일지</span>
          </div>
        }
        footer={
          isTeacher ? (
            isEditing ? (
              <Button
                variant="primary"
                size="small"
                className="font-body2-heading px-12"
                onClick={handleSave}
              >
                수정 완료
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  className="font-body2-heading px-12"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  삭제
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  className="font-body2-heading px-12"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </Button>
              </>
            )
          ) : undefined
        }
      >
        <div className="flex flex-1 flex-col">
          {isEditing ? (
            <TextEditor
              value={content}
              onChange={setContent}
              targetType="TEACHING_NOTE"
              minHeight="320px"
              maxHeight="320px"
            />
          ) : (
            <div className="border-line-line1 flex-1 overflow-y-auto rounded-xl border p-4">
              <TextViewer value={content} />
            </div>
          )}
        </div>
      </ConsultationDialogLayout>

      <DeleteConfirm
        date={date}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={onDelete}
      />
    </>
  );
};
