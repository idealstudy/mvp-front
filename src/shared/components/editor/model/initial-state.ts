import type { TextEditorValue } from '@/shared/components/editor/types';

export const initialTextEditorValue: TextEditorValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};
