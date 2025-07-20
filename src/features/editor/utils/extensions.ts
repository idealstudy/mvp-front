import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKitExtension from '@tiptap/starter-kit';

export const defaultExtensions = [
  StarterKitExtension.configure({
    gapcursor: false,
  }),
  TextStyleKit,
];
