import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';

import { TextEditorValue } from '../utils';
import { defaultExtensions } from '../utils/extensions';
import { Toolbar } from './toolbar';

type TextEditorProps = {
  className?: string;
  value: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
  placeholder?: string;
};

export const TextEditor = ({
  className,
  value,
  onChange,
  placeholder = '',
}: TextEditorProps) => {
  const extensions = useMemo(
    () => [
      ...defaultExtensions,
      Placeholder.configure({
        placeholder,
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
          'outline-none min-h-[310px] max-h-[500px] overflow-y-auto px-5 py-4 w-full',
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
    <div className="border-line-line2 flex w-full flex-col rounded-[4px] border">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
