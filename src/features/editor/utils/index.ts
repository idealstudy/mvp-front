import { JSONContent } from '@tiptap/react';

export type TextEditorValue = JSONContent;

export const initialTextEditorValue: TextEditorValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};
