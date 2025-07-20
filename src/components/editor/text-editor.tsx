import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKitExtension from '@tiptap/starter-kit';

import styles from './text-editor.module.css';
import { Toolbar } from './toolbar';

export type EditorValue = JSONContent;

type TextEditorProps = {
  className?: string;
  value: EditorValue;
  onChange: (value: EditorValue) => void;
  placeholder?: string;
};

export const initialTextEditorValue: EditorValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

export const TextEditor = ({
  className,
  value,
  onChange,
  placeholder = '',
}: TextEditorProps) => {
  const extensions = useMemo(
    () => [
      StarterKitExtension.configure({
        gapcursor: false,
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
    ],
    [placeholder]
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: cn(
          'outline-none min-h-[264px] max-h-[500px] px-5 py-4',
          styles['tiptap'],
          className
        ),
      },
    },
    immediatelyRender: false,
  });

  if (editor === null) {
    return null;
  }

  return (
    <div className="border-line-line2 flex flex-col rounded-[4px] border">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
