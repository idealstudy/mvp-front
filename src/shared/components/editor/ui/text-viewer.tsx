'use client';

import { useEffect } from 'react';

import { EditorViewerContext } from '@/shared/components/editor/model/editor-viewer-context';
import { createNotionExtensions } from '@/shared/components/editor/model/extensions';
import { TextViewerProps } from '@/shared/components/editor/types';
import { cn } from '@/shared/lib';
import { EditorContent, useEditor } from '@tiptap/react';

import '../styles/text-editor.css';

// 뷰어용 확장 (슬래시 커맨드, placeholder 비활성화)
const viewerExtensions = createNotionExtensions({
  placeholder: '',
  enableSlashCommand: false,
});

export const TextViewer = ({
  className,
  value,
  onFileDownloadBlocked,
  blockFileDownload,
}: TextViewerProps) => {
  const editor = useEditor({
    extensions: viewerExtensions,
    content: value,
    editable: false, // 읽기 전용으로 설정
    editorProps: {
      attributes: {
        class: cn('notion-editor-content outline-none w-full', className),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    editor.commands.setContent(value);
  }, [editor, value]);

  return (
    <EditorViewerContext.Provider
      value={{
        onLoginRequired: onFileDownloadBlocked,
        shouldBlockDownload: blockFileDownload,
      }}
    >
      <EditorContent editor={editor} />
    </EditorViewerContext.Provider>
  );
};
