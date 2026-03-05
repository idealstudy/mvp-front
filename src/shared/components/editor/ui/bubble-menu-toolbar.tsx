'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';
import { Editor, useEditorState } from '@tiptap/react';
import {
  Bold,
  Code,
  Highlighter,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from 'lucide-react';

type BubbleMenuToolbarProps = {
  editor: Editor;
  darkMode?: boolean;
  onOpenLinkDialog?: () => void;
};

export const BubbleMenuToolbar = ({
  editor,
  darkMode = false,
  onOpenLinkDialog,
}: BubbleMenuToolbarProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

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
    }),
  });

  // 선택 영역 변경 감지
  useEffect(() => {
    const updateMenu = () => {
      const { selection } = editor.state;
      const { empty, from, to } = selection;

      // 선택 영역이 없거나 코드블록 내부면 숨김
      if (empty || editor.isActive('codeBlock')) {
        setIsVisible(false);
        return;
      }

      // 선택된 텍스트가 있으면 메뉴 표시
      const { view } = editor;

      try {
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);

        // 메뉴 크기 (기본값 설정)
        const menuHeight = 40;
        const menuWidth = 280;

        // fixed 포지션이므로 viewport 기준 좌표 사용 (scrollX/Y 불필요)
        const left = Math.max(
          10,
          Math.min(
            (start.left + end.left) / 2 - menuWidth / 2,
            window.innerWidth - menuWidth - 10
          )
        );

        // 선택 영역 위쪽에 표시 (메뉴 높이 + 간격 8px)
        let top = start.top - menuHeight - 8;

        // 위쪽 공간이 부족하면 아래쪽에 표시
        if (top < 10) {
          top = end.bottom + 8;
        }

        setPosition({ top, left });
        setIsVisible(true);
      } catch {
        // coordsAtPos 에러 시 숨김
        setIsVisible(false);
      }
    };

    const handleBlur = () => {
      // blur 시 약간의 딜레이 후 숨김 (버튼 클릭 허용)
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 200);
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);
    editor.on('blur', handleBlur);

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
      editor.off('blur', handleBlur);
    };
  }, [editor]);

  const handleRemoveLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'notion-bubble-menu',
        'fixed z-[9999] flex items-center gap-0.5 rounded-lg border p-1 shadow-lg',
        'animate-in fade-in-0 slide-in-from-bottom-2 duration-150',
        darkMode
          ? 'border-gray-scale-gray-70 bg-gray-scale-gray-80'
          : 'border-line-line2 bg-gray-scale-white'
      )}
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()} // 클릭 시 에디터 blur 방지
    >
      <BubbleButton
        active={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        darkMode={darkMode}
        title="굵게"
      >
        <Bold size={14} />
      </BubbleButton>
      <BubbleButton
        active={editorState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        darkMode={darkMode}
        title="기울임"
      >
        <Italic size={14} />
      </BubbleButton>
      <BubbleButton
        active={editorState.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        darkMode={darkMode}
        title="밑줄"
      >
        <Underline size={14} />
      </BubbleButton>
      <BubbleButton
        active={editorState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        darkMode={darkMode}
        title="취소선"
      >
        <Strikethrough size={14} />
      </BubbleButton>
      <BubbleDivider darkMode={darkMode} />
      <BubbleButton
        active={editorState.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        darkMode={darkMode}
        title="인라인 코드"
      >
        <Code size={14} />
      </BubbleButton>
      <BubbleButton
        active={editorState.isHighlight}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        darkMode={darkMode}
        title="하이라이트"
      >
        <Highlighter size={14} />
      </BubbleButton>
      <BubbleDivider darkMode={darkMode} />
      <BubbleButton
        active={editorState.isLink}
        onClick={() => {
          if (editorState.isLink) {
            handleRemoveLink();
            return;
          }
          onOpenLinkDialog?.();
        }}
        darkMode={darkMode}
        title={editorState.isLink ? '링크 제거' : '링크 추가'}
      >
        <Link size={14} />
      </BubbleButton>
    </div>
  );
};

// Sub Components
const BubbleDivider = ({ darkMode }: { darkMode: boolean }) => (
  <div
    className={cn(
      'mx-0.5 h-4 w-px',
      darkMode ? 'bg-gray-scale-gray-60' : 'bg-line-line2'
    )}
  />
);

type BubbleButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
  title?: string;
};

const BubbleButton = ({
  children,
  active = false,
  onClick,
  darkMode = false,
  title,
}: BubbleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cn(
      'flex h-7 w-7 items-center justify-center rounded transition-colors',
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
