import { ListKit } from '@tiptap/extension-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKitExtension from '@tiptap/starter-kit';

export const defaultExtensions = [
  StarterKitExtension.configure({
    gapcursor: false,
  }),
  TextStyleKit,
  ListKit,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];
