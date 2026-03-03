import { useCallback, useEffect, useMemo, useRef } from 'react';

import { createNotionExtensions } from '@/shared/components/editor/model/extensions';
import { NotionEditorProps } from '@/shared/components/editor/types';
import {
  validateAttachmentFile,
  validateImageFile,
} from '@/shared/components/editor/utils';
import { cn } from '@/shared/lib';
import { Editor, useEditor } from '@tiptap/react';

export type UseTextEditorOptions = Pick<
  NotionEditorProps,
  | 'value'
  | 'onChange'
  | 'placeholder'
  | 'darkMode'
  | 'autoFocus'
  | 'enableSlashCommand'
  | 'readOnly'
  | 'minHeight'
  | 'maxHeight'
  | 'className'
  | 'ariaLabel'
> & {
  onLinkShortcut?: () => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageBatchUpload: (files: File[]) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  onFileBatchUpload: (files: File[]) => Promise<void>;
};

export type UseTextEditorReturn = {
  editor: Editor | null;
  editorRef: React.MutableRefObject<Editor | null>;
  editorProps: {
    attributes: {
      class: string;
      style: string;
    };
    handleDrop: (
      view: unknown,
      event: DragEvent,
      slice: unknown,
      moved: boolean
    ) => boolean;
    handlePaste: (view: unknown, event: ClipboardEvent) => boolean;
  };
};

export const useTextEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요. "/" 를 입력하면 명령어를 사용할 수 있습니다.',
  darkMode = false,
  autoFocus = false,
  enableSlashCommand = true,
  readOnly = false,
  minHeight = '200px',
  maxHeight = '600px',
  className,
  onLinkShortcut,
  onImageUpload,
  onImageBatchUpload,
  onFileUpload,
  onFileBatchUpload,
}: UseTextEditorOptions): UseTextEditorReturn => {
  const editorRef = useRef<Editor | null>(null);
  const prevValueRef = useRef<string>('');
  const isInternalChangeRef = useRef(false);

  const extensions = useMemo(
    () =>
      createNotionExtensions({
        placeholder,
        enableSlashCommand,
        onLinkShortcut,
      }),
    [placeholder, enableSlashCommand, onLinkShortcut]
  );

  const handleDrop = useCallback(
    (
      view: unknown,
      event: DragEvent,
      slice: unknown,
      moved: boolean
    ): boolean => {
      if (!moved && event.dataTransfer?.files?.length) {
        const files = Array.from(event.dataTransfer.files);
        const { imageFiles, attachmentFiles } = categorizeFiles(files);

        if (imageFiles.length > 0 || attachmentFiles.length > 0) {
          event.preventDefault();

          if (imageFiles.length > 0) {
            if (imageFiles.length === 1 && imageFiles[0]) {
              onImageUpload(imageFiles[0]);
            } else {
              onImageBatchUpload(imageFiles);
            }
          }

          if (attachmentFiles.length > 0) {
            if (attachmentFiles.length === 1 && attachmentFiles[0]) {
              onFileUpload(attachmentFiles[0]);
            } else {
              onFileBatchUpload(attachmentFiles);
            }
          }

          return true;
        }
      }
      return false;
    },
    [onImageUpload, onImageBatchUpload, onFileUpload, onFileBatchUpload]
  );

  const handlePaste = useCallback(
    (view: unknown, event: ClipboardEvent): boolean => {
      const items = event.clipboardData?.items;
      if (items) {
        const { imageFiles, attachmentFiles } = collectFilesFromItems(items);

        if (imageFiles.length > 0 || attachmentFiles.length > 0) {
          event.preventDefault();

          if (imageFiles.length > 0) {
            if (imageFiles.length === 1 && imageFiles[0]) {
              onImageUpload(imageFiles[0]);
            } else {
              onImageBatchUpload(imageFiles);
            }
          }

          if (attachmentFiles.length > 0) {
            if (attachmentFiles.length === 1 && attachmentFiles[0]) {
              onFileUpload(attachmentFiles[0]);
            } else {
              onFileBatchUpload(attachmentFiles);
            }
          }

          return true;
        }
      }
      return false;
    },
    [onImageUpload, onImageBatchUpload, onFileUpload, onFileBatchUpload]
  );

  const editor = useEditor({
    extensions,
    content: value,
    editable: !readOnly,
    autofocus: autoFocus,
    onUpdate: ({ editor: updatedEditor }) => {
      isInternalChangeRef.current = true;
      onChange(updatedEditor.getJSON());
    },
    editorProps: {
      attributes: {
        class: cn(
          'notion-editor-content',
          'outline-none w-full px-4 py-3',
          'prose prose-sm sm:prose-base max-w-none',
          darkMode && 'prose-invert',
          className
        ),
        style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow-y: auto;`,
      },
      handleDrop,
      handlePaste,
    },
    immediatelyRender: false,
  });

  // editor가 생성된 후 ref 업데이트
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // 외부에서 content가 변경되면 에디터 동기화
  useEffect(() => {
    if (!editor || !value) return;

    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      prevValueRef.current = JSON.stringify(value);
      return;
    }

    const newContentStr = JSON.stringify(value);

    if (prevValueRef.current !== newContentStr) {
      prevValueRef.current = newContentStr;
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return {
    editor,
    editorRef,
    editorProps: {
      attributes: {
        class: cn(
          'notion-editor-content',
          'outline-none w-full px-4 py-3',
          'prose prose-sm sm:prose-base max-w-none',
          darkMode && 'prose-invert',
          className
        ),
        style: `min-height: ${minHeight}; max-height: ${maxHeight}; overflow-y: auto;`,
      },
      handleDrop,
      handlePaste,
    },
  };
};

// Helper functions
function categorizeFiles(files: File[]): {
  imageFiles: File[];
  attachmentFiles: File[];
} {
  const imageFiles: File[] = [];
  const attachmentFiles: File[] = [];

  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        imageFiles.push(file);
      }
    } else {
      const validation = validateAttachmentFile(file);
      if (validation.valid) {
        attachmentFiles.push(file);
      }
    }
  });

  return { imageFiles, attachmentFiles };
}

function collectFilesFromItems(items: DataTransferItemList): {
  imageFiles: File[];
  attachmentFiles: File[];
} {
  const imageFiles: File[] = [];
  const attachmentFiles: File[] = [];

  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file) {
        if (item.type.startsWith('image/')) {
          const validation = validateImageFile(file);
          if (validation.valid) {
            imageFiles.push(file);
          }
        } else {
          const validation = validateAttachmentFile(file);
          if (validation.valid) {
            attachmentFiles.push(file);
          }
        }
      }
    }
  }

  return { imageFiles, attachmentFiles };
}
