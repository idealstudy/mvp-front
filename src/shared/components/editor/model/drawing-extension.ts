import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { DrawingNodeView } from '../ui/drawing-node';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    drawing: {
      setDrawing: (options: {
        documentId: string;
        pdfUrl?: string;
      }) => ReturnType;
    };
  }
}

export const DrawingExtension = Node.create({
  name: 'drawing',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      pdfUrl: { default: null },
      documentId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="drawing"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'drawing' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawingNodeView);
  },

  addCommands() {
    return {
      setDrawing:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    };
  },
});
