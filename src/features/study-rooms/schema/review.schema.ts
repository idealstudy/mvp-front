import { extractText, hasNonTextContent } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

const contentSchema = z.custom<JSONContent>().superRefine((val, ctx) => {
  const length = extractText(JSON.stringify(val)).trim().length;

  if (length < 1 && !hasNonTextContent(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '내용 또는 이미지를 입력해주세요.',
    });
  }

  if (length > 1000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '1000자 이상은 입력하실 수 없습니다.',
    });
  }
});

export const ReviewFormSchema = z.object({
  content: contentSchema,
  startDate: z.string().min(1, '수업 시작일을 입력해주세요.'),
  endDate: z.string().optional(),
});

export type ReviewForm = z.infer<typeof ReviewFormSchema>;
