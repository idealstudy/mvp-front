import { cn } from '@/lib/utils';
import { EditorContent, useEditor } from '@tiptap/react';

import { TextEditorValue } from '../utils';
import { defaultExtensions } from '../utils/extensions';

type TextViewerProps = {
  className?: string;
  value: TextEditorValue;
};

export const TextViewer = ({ className, value }: TextViewerProps) => {
  const editor = useEditor({
    extensions: defaultExtensions,
    content: value,
    editorProps: {
      attributes: {
        class: cn('outline-none w-full', className),
      },
    },
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
};
