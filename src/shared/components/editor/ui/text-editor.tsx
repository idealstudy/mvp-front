import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useEditorUploads,
  useTextEditor,
} from '@/shared/components/editor/hooks';
import { NotionEditorProps } from '@/shared/components/editor/types';
import { cn } from '@/shared/lib';
import { EditorContent } from '@tiptap/react';

import '../styles/text-editor.css';
import { BubbleMenuToolbar } from './bubble-menu-toolbar';
import { EditorToolbar } from './editor-toolbar';
import { LinkDialog } from './link-dialog';

type LinkSelection = {
  from: number;
  to: number;
  hadSelection: boolean;
};

export const TextEditor = ({
  className,
  value,
  onChange,
  placeholder = '내용을 입력하세요. "/" 를 입력하면 명령어를 사용할 수 있습니다.',
  darkMode = false,
  autoFocus = false,
  enableSlashCommand = true,
  showToolbar = true,
  showBubbleMenu = true,
  minHeight = '200px',
  maxHeight = '600px',
  readOnly = false,
  targetType = 'TEACHING_NOTE',
  onImageUpload: customImageUpload,
  onFileUpload: customFileUpload,
  onError,
  ariaLabel,
}: NotionEditorProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkDialogText, setLinkDialogText] = useState('');
  const [linkDialogUrl, setLinkDialogUrl] = useState('');
  const [linkSelection, setLinkSelection] = useState<LinkSelection | null>(
    null
  );
  const openLinkDialogRef = useRef<() => void>(() => {});

  const {
    handleImageUpload,
    handleImageBatchUpload,
    handleFileUpload,
    handleFileBatchUpload,
  } = useEditorUploads({
    targetType,
    onImageUpload: customImageUpload,
    onFileUpload: customFileUpload,
    onError,
  });

  const { editor, editorRef } = useTextEditor({
    value,
    onChange,
    placeholder,
    darkMode,
    autoFocus,
    enableSlashCommand,
    readOnly,
    minHeight,
    maxHeight,
    className,
    ariaLabel,
    onLinkShortcut: () => openLinkDialogRef.current?.(),
    onImageUpload: (file) => handleImageUpload(file, editorRef.current),
    onImageBatchUpload: (files) =>
      handleImageBatchUpload(files, editorRef.current),
    onFileUpload: (file) => handleFileUpload(file, editorRef.current),
    onFileBatchUpload: (files) =>
      handleFileBatchUpload(files, editorRef.current),
  });

  const openLinkDialog = useCallback(() => {
    if (!editor) return;

    const { from, to, empty } = editor.state.selection;
    const selectedText = !empty
      ? editor.state.doc.textBetween(from, to, ' ').trim()
      : '';
    const existingHref = editor.getAttributes('link').href ?? '';

    setLinkSelection({
      from,
      to,
      hadSelection: !empty,
    });
    setLinkDialogText(selectedText);
    setLinkDialogUrl(existingHref);
    setIsLinkDialogOpen(true);
  }, [editor]);

  useEffect(() => {
    openLinkDialogRef.current = openLinkDialog;
  }, [openLinkDialog]);

  const closeLinkDialog = useCallback((open: boolean) => {
    setIsLinkDialogOpen(open);
    if (!open) {
      setLinkSelection(null);
      setLinkDialogText('');
      setLinkDialogUrl('');
    }
  }, []);

  const handleLinkDialogSubmit = useCallback(
    ({ text, url }: { text: string; url: string }) => {
      if (!editor) return;

      const fallbackText = text || url;
      const selection = linkSelection;

      if (selection) {
        const { from, to, hadSelection } = selection;
        const shouldReplaceSelection =
          fallbackText.length > 0 && (!hadSelection || text.length > 0);

        if (shouldReplaceSelection) {
          editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent(fallbackText)
            .setTextSelection({ from, to: from + fallbackText.length })
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        } else {
          editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        }
      } else {
        const insertFrom = editor.state.selection.from;
        editor
          .chain()
          .focus()
          .insertContent(fallbackText)
          .setTextSelection({
            from: insertFrom,
            to: insertFrom + fallbackText.length,
          })
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      }

      setIsLinkDialogOpen(false);
      setLinkSelection(null);
      setLinkDialogText('');
      setLinkDialogUrl('');
    },
    [editor, linkSelection]
  );

  if (editor === null) {
    return (
      <div
        className={cn(
          'notion-editor-skeleton',
          'animate-pulse rounded-lg border',
          darkMode
            ? 'border-gray-scale-gray-70 bg-gray-scale-gray-90'
            : 'border-line-line2 bg-gray-scale-gray-5'
        )}
        style={{ minHeight }}
        aria-label="에디터 로딩 중"
      />
    );
  }

  return (
    <div
      className={cn(
        'notion-editor',
        'relative flex w-full flex-col rounded-lg border transition-colors',
        darkMode
          ? 'border-gray-scale-gray-70 bg-gray-scale-gray-90 text-gray-scale-white'
          : 'border-line-line2 bg-gray-scale-white text-text-main',
        'focus-within:border-key-color-primary focus-within:ring-key-color-primary/20 focus-within:ring-1'
      )}
      role="textbox"
      aria-label={ariaLabel || '리치 텍스트 에디터'}
      aria-multiline="true"
      data-dark-mode={darkMode}
    >
      {showToolbar && !readOnly && (
        <EditorToolbar
          editor={editor}
          darkMode={darkMode}
          onImageUpload={(file) => handleImageUpload(file, editor)}
          onFileUpload={(file) => handleFileUpload(file, editor)}
          onOpenLinkDialog={openLinkDialog}
        />
      )}
      {showBubbleMenu && !readOnly && (
        <BubbleMenuToolbar
          editor={editor}
          darkMode={darkMode}
          onOpenLinkDialog={openLinkDialog}
        />
      )}
      <EditorContent editor={editor} />
      <LinkDialog
        isOpen={isLinkDialogOpen}
        initialText={linkDialogText}
        initialUrl={linkDialogUrl}
        onOpenChange={closeLinkDialog}
        onSubmit={handleLinkDialogSubmit}
      />
    </div>
  );
};
