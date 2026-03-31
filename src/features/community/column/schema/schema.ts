import { extractText } from '@/shared/lib';
import { JSONContent } from '@tiptap/core';
import { z } from 'zod';

export const ColumnFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(100, '제목은 100자 이내로 입력해주세요.'),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractText(JSON.stringify(val));
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
  tags: z
    .array(z.string())
    .min(1, '태그를 최소 1개 입력해주세요.')
    .max(3, '태그는 최대 3개까지 추가할 수 있습니다.'),
});

export type ColumnForm = z.infer<typeof ColumnFormSchema>;
