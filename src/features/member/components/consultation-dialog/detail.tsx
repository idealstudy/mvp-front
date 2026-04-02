'use client';

import { TextEditor, TextViewer } from '@/shared/components/editor';
import { TextEditorValue } from '@/shared/components/editor/types';

type Props = {
  isEditing: boolean;
  content: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
};

export const ConsultationDetailContent = ({
  isEditing,
  content,
  onChange,
}: Props) => {
  return (
    <div className="flex flex-1 flex-col">
      {isEditing ? (
        <TextEditor
          value={content}
          onChange={onChange}
          minHeight="320px"
          maxHeight="320px"
        />
      ) : (
        <div className="border-line-line1 flex-1 overflow-y-auto rounded-xl border p-4">
          <TextViewer value={content} />
        </div>
      )}
    </div>
  );
};
