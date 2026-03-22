import { JSONContent } from '@tiptap/react';

const NON_TEXT_CONTENT_TYPES = [
  'image',
  'fileAttachment',
  'embed',
  'linkPreview',
] as const;

export const extractTextFromTiptapJSON = (doc: JSONContent): string => {
  if (!doc || !doc.content) return '';

  let text = '';

  const traverse = (nodes: JSONContent[]) => {
    nodes.forEach((node) => {
      if (node.type === 'text' && node.text) {
        text += node.text;
      } else if (node.content) {
        traverse(node.content);
      }
    });
  };

  traverse(doc.content);
  return text;
};

export const hasNonTextContent = (doc: JSONContent): boolean => {
  if (!doc || !doc.content) return false;

  let found = false;

  const traverse = (nodes: JSONContent[]) => {
    nodes.forEach((node) => {
      if (found) return;

      if (
        node.type &&
        NON_TEXT_CONTENT_TYPES.includes(
          node.type as (typeof NON_TEXT_CONTENT_TYPES)[number]
        )
      ) {
        found = true;
        return;
      }

      if (node.content) {
        traverse(node.content);
      }
    });
  };

  traverse(doc.content);
  return found;
};
