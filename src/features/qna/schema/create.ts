import { hasNonTextContent } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

const extractTextFromTiptapJSON = (doc: JSONContent): string => {
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) {
    return '';
  }
  let text = '';

  const traverse = (nodes: JSONContent[]) => {
    nodes.forEach((node) => {
      if (node.type === 'text' && typeof node.text === 'string') {
        text += node.text;
      }

      if (Array.isArray(node.content)) {
        traverse(node.content);
      }
    });
  };

  traverse(doc.content);
  return text;
};

export const QnaACreateFormSchema = z.object({
  title: z
    .string()
    .min(1, '질문 제목을 작성해 주세요!')
    .max(50, '질문 제목은 30자 이하로 입력해주세요.'),
  studyRoomId: z.number({ required_error: '스터디룸을 선택해 주세요!' }),
  relatedTeachingNoteId: z.number().nullable(),
  visibility: z.enum(['STUDENT_AND_PARENT', 'STUDENT_ONLY'], {
    required_error: '공개 범위를 선택해주세요.',
  }),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractTextFromTiptapJSON(val);
    const length = plainText.trim().length;
    const hasAttachment = hasNonTextContent(val);

    if (length < 1 && !hasAttachment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용 또는 첨부 파일을 입력해 주세요.',
      });
    }

    if (length > 3000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '3000자 이상은 입력하실 수 없습니다.',
      });
    }
  }),
});

export const QnAMessageFormSchema = z.object({
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractTextFromTiptapJSON(val);
    const length = plainText.trim().length;
    const hasAttachment = hasNonTextContent(val);

    if (length < 1 && !hasAttachment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용 또는 첨부 파일을 입력해 주세요.',
      });
    }

    if (length > 3000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '3000자 이상은 입력하실 수 없습니다.',
      });
    }
  }),
});

export type QnACreateForm = z.infer<typeof QnaACreateFormSchema>;
export type QnAMessageForm = z.infer<typeof QnAMessageFormSchema>;
