import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { ConnectedMember } from '../type';

const extractTextFromTiptapJSON = (doc: JSONContent): string => {
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

export const StudyNoteSchema = z.object({
  title: z
    .string()
    .min(1, '수업 노트 제목을 작성해 주세요!')
    .max(30, '수업노트 제목은 30자 이하로 입력해주세요'),
  studyRoomId: z.number({ required_error: '스터디룸을 선택해 주세요!' }),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractTextFromTiptapJSON(val);
    const length = plainText.trim().length;

    if (length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용은 최소 10자 이상이어야 합니다.',
      });
    }

    if (length > 3000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '3000자 이상은 입력하실 수 없습니다.',
      });
    }
  }),
  visibility: z.string().min(1, '공개 범위를 설정해 주세요'),
  parentOnly: z.boolean().optional(),
  taughtAt: z.string().min(1, '날짜를 선택해 주세요'),
  studentIds: z
    .array(z.custom<ConnectedMember>())
    .nonempty('수업에 참여한 학생들을 입력해 주세요'),
});

export type StudyNoteForm = z.infer<typeof StudyNoteSchema>;
