'use client';

import { useCallback, useRef, useState } from 'react';

import {
  FILE_UPLOAD_CONFIG,
  IMAGE_UPLOAD_CONFIG,
} from '@/shared/components/editor/constants';
import { useLinkPreview } from '@/shared/components/editor/model/use-link-preview';
import { validateAttachmentFile } from '@/shared/components/editor/utils';
import { cn } from '@/shared/lib';
import { Editor, useEditorState } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Paperclip,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
  Video,
} from 'lucide-react';

type EditorToolbarProps = {
  editor: Editor;
  darkMode?: boolean;
  onImageUpload?: (file: File) => void;
  onFileUpload?: (file: File) => void;
  onOpenLinkDialog?: () => void;
};

export const EditorToolbar = ({
  editor,
  darkMode = false,
  onImageUpload,
  onFileUpload,
  onOpenLinkDialog,
}: EditorToolbarProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmbedInput, setShowEmbedInput] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  const { fetchPreviewAsync } = useLinkPreview();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
      isCode: ctx.editor.isActive('code'),
      isHighlight: ctx.editor.isActive('highlight'),
      isLink: ctx.editor.isActive('link'),
      isHeading1: ctx.editor.isActive('heading', { level: 1 }),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isHeading3: ctx.editor.isActive('heading', { level: 3 }),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isTaskList: ctx.editor.isActive('taskList'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      textAlign: ctx.editor.isActive({ textAlign: 'center' })
        ? 'center'
        : ctx.editor.isActive({ textAlign: 'right' })
          ? 'right'
          : 'left',
    }),
  });

  const handleImageButtonClick = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        if (onImageUpload) {
          onImageUpload(file);
        }
      }
      event.target.value = '';
    },
    [onImageUpload]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const validation = validateAttachmentFile(file);
        if (validation.valid) {
          onFileUpload?.(file);
        } else {
          alert(validation.error);
        }
      }
      event.target.value = '';
    },
    [onFileUpload]
  );

  const handleRemoveLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const handleEmbedSubmit = useCallback(async () => {
    if (embedUrl) {
      // YouTube, Vimeo 등의 URL 파싱
      const { parseEmbedUrl, getEmbedTypeFromUrl } = await import(
        '../model/embed-extension'
      );
      const parsed = parseEmbedUrl(embedUrl);

      if (parsed) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'embed',
            attrs: {
              url: embedUrl,
              type: parsed.type,
              embedUrl: parsed.embedUrl,
            },
          })
          .run();
      } else {
        try {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'linkPreview',
              attrs: {
                url: embedUrl,
                loading: true,
              },
            })
            .run();

          // API 호출
          const result = await fetchPreviewAsync(embedUrl);

          // 문서에서 loading=true인 linkPreview 노드를 찾아서 교체
          const { state } = editor;
          let foundPos: number | null = null;

          state.doc.descendants((node, pos) => {
            if (
              node.type.name === 'linkPreview' &&
              node.attrs.url === embedUrl &&
              node.attrs.loading === true
            ) {
              foundPos = pos;
              return false; // 찾았으면 순회 중단
            }
          });

          if (foundPos !== null) {
            const tr = state.tr;
            if (result.available && result.data) {
              if (
                result.data.embedType === 'OEMBED' &&
                result.data.embedUrl &&
                state.schema.nodes.embed
              ) {
                tr.setNodeMarkup(foundPos, state.schema.nodes.embed, {
                  url: result.data.url,
                  type: getEmbedTypeFromUrl(result.data.embedUrl),
                  embedUrl: result.data.embedUrl,
                  title: result.data.title,
                });
              } else {
                // available: true → 링크 미리보기 카드로 업데이트
                tr.setNodeMarkup(foundPos, undefined, {
                  url: result.data.url,
                  title: result.data.title,
                  description: result.data.description,
                  image: result.data.image,
                  siteName: result.data.siteName,
                  loading: false,
                });
              }
            } else {
              // available: false → 노드 삭제하고 일반 링크로 교체
              const node = state.doc.nodeAt(foundPos);
              const linkMark = state.schema.marks.link;
              if (node && linkMark) {
                tr.delete(foundPos, foundPos + node.nodeSize);
                tr.insertText(embedUrl, foundPos);
                tr.addMark(
                  foundPos,
                  foundPos + embedUrl.length,
                  linkMark.create({ href: embedUrl })
                );
              }
            }
            editor.view.dispatch(tr);
          }
        } catch {
          // 에러 발생 시 loading 노드 찾아서 일반 링크로 교체
          const { state } = editor;
          let foundPos: number | null = null;

          state.doc.descendants((node, pos) => {
            if (
              node.type.name === 'linkPreview' &&
              node.attrs.url === embedUrl &&
              node.attrs.loading === true
            ) {
              foundPos = pos;
              return false;
            }
          });

          if (foundPos !== null) {
            const tr = state.tr;
            const node = state.doc.nodeAt(foundPos);
            const linkMark = state.schema.marks.link;
            if (node && linkMark) {
              tr.delete(foundPos, foundPos + node.nodeSize);
              tr.insertText(embedUrl, foundPos);
              tr.addMark(
                foundPos,
                foundPos + embedUrl.length,
                linkMark.create({ href: embedUrl })
              );
            }
            editor.view.dispatch(tr);
          }
        }
      }
    }
    setShowEmbedInput(false);
    setEmbedUrl('');
  }, [editor, embedUrl, fetchPreviewAsync]);

  return (
    <div
      className={cn(
        'notion-toolbar',
        'flex flex-wrap items-center gap-1 border-b px-2 py-1.5',
        darkMode
          ? 'border-gray-scale-gray-70 bg-gray-scale-gray-80'
          : 'border-line-line2 bg-background-gray'
      )}
    >
      {/* Text Style Group */}
      <ToolbarGroup>
        <ToolbarButton
          active={editorState.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          darkMode={darkMode}
          title="굵게 (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          darkMode={darkMode}
          title="기울임 (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          darkMode={darkMode}
          title="밑줄 (Ctrl+U)"
        >
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          darkMode={darkMode}
          title="취소선"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
          darkMode={darkMode}
          title="인라인 코드"
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isHighlight}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          darkMode={darkMode}
          title="하이라이트"
        >
          <Highlighter size={16} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* Heading Group */}
      <ToolbarGroup>
        <ToolbarButton
          active={editorState.isHeading1}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          darkMode={darkMode}
          title="제목 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isHeading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          darkMode={darkMode}
          title="제목 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isHeading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          darkMode={darkMode}
          title="제목 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* List Group */}
      <ToolbarGroup>
        <ToolbarButton
          active={editorState.isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          darkMode={darkMode}
          title="글머리 기호 목록"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          darkMode={darkMode}
          title="번호 목록"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isTaskList}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          darkMode={darkMode}
          title="할 일 목록"
        >
          <ListChecks size={16} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* Block Group */}
      <ToolbarGroup>
        <ToolbarButton
          active={editorState.isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          darkMode={darkMode}
          title="인용"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.isCodeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          darkMode={darkMode}
          title="코드 블록"
        >
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          darkMode={darkMode}
          title="구분선"
        >
          <Minus size={16} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* Media Group */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={handleImageButtonClick}
          darkMode={darkMode}
          title="이미지 업로드"
        >
          <ImageIcon size={16} />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept={IMAGE_UPLOAD_CONFIG.allowedMimeTypes.join(',')}
          className="hidden"
          onChange={handleImageChange}
        />
        {onFileUpload && (
          <>
            <ToolbarButton
              onClick={handleFileButtonClick}
              darkMode={darkMode}
              title="파일 첨부"
            >
              <Paperclip size={16} />
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_UPLOAD_CONFIG.allowedExtensions
                .map((ext) => `.${ext}`)
                .join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
        <ToolbarButton
          active={editorState.isLink}
          onClick={() => {
            if (editorState.isLink) {
              handleRemoveLink();
              return;
            }
            onOpenLinkDialog?.();
          }}
          darkMode={darkMode}
          title={editorState.isLink ? '링크 제거' : '링크 추가 (Ctrl+K)'}
        >
          <Link size={16} />
        </ToolbarButton>
        <div className="relative">
          <ToolbarButton
            active={showEmbedInput}
            onClick={() => setShowEmbedInput(!showEmbedInput)}
            darkMode={darkMode}
            title="동영상 임베드 (YouTube, Vimeo)"
          >
            <Video size={16} />
          </ToolbarButton>
          {showEmbedInput && (
            <div
              className={cn(
                'absolute top-full left-0 z-50 mt-1 flex items-center gap-1 rounded-md border p-1 shadow-lg',
                darkMode
                  ? 'border-gray-scale-gray-70 bg-gray-scale-gray-80'
                  : 'border-line-line2 bg-gray-scale-white'
              )}
            >
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="YouTube/Vimeo URL"
                className={cn(
                  'w-56 rounded px-2 py-1 text-sm outline-none',
                  darkMode
                    ? 'bg-gray-scale-gray-90 text-gray-scale-white placeholder:text-gray-scale-gray-50'
                    : 'bg-background-gray text-text-main placeholder:text-text-sub'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmbedSubmit();
                  } else if (e.key === 'Escape') {
                    setShowEmbedInput(false);
                    setEmbedUrl('');
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleEmbedSubmit}
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium',
                  'bg-key-color-primary text-gray-scale-white hover:bg-key-color-primary/80'
                )}
              >
                삽입
              </button>
            </div>
          )}
        </div>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* Align Group */}
      <ToolbarGroup>
        <ToolbarButton
          active={editorState.textAlign === 'left'}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          darkMode={darkMode}
          title="왼쪽 정렬"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.textAlign === 'center'}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          darkMode={darkMode}
          title="가운데 정렬"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editorState.textAlign === 'right'}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          darkMode={darkMode}
          title="오른쪽 정렬"
        >
          <AlignRight size={16} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider darkMode={darkMode} />

      {/* Undo/Redo */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          darkMode={darkMode}
          title="실행 취소 (Ctrl+Z)"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          darkMode={darkMode}
          title="다시 실행 (Ctrl+Y)"
        >
          <Redo size={16} />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
};

// Sub Components
const ToolbarGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-0.5">{children}</div>
);

const ToolbarDivider = ({ darkMode }: { darkMode: boolean }) => (
  <div
    className={cn(
      'mx-1 h-5 w-px',
      darkMode ? 'bg-gray-scale-gray-60' : 'bg-line-line2'
    )}
  />
);

type ToolbarButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
  title?: string;
};

const ToolbarButton = ({
  children,
  active = false,
  disabled = false,
  onClick,
  darkMode = false,
  title,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'flex h-7 w-7 items-center justify-center rounded transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40',
      darkMode
        ? [
            'text-gray-scale-gray-30 hover:bg-gray-scale-gray-70 hover:text-gray-scale-white',
            active && 'bg-key-color-primary/20 text-key-color-primary',
          ]
        : [
            'text-text-sub hover:bg-gray-scale-gray-10 hover:text-text-main',
            active && 'bg-key-color-primary/10 text-key-color-primary',
          ]
    )}
  >
    {children}
  </button>
);
