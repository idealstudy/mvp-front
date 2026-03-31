import { extractText } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

// 문의 등록
export const ConsultationFormSchema = z.object({
  teacherId: z.number({ required_error: '선생님을 선택해주세요.' }),
  studyRoomId: z.number().optional(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractText(JSON.stringify(val));
    const length = plainText.trim().length;

    if (length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용은 최소 1자 이상이어야 합니다.',
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

// 답변 등록
export const ConsultationAnswerFormSchema = z.object({
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    const plainText = extractText(JSON.stringify(val));
    const length = plainText.trim().length;

    if (length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '내용은 최소 1자 이상이어야 합니다.',
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

export type ConsultationForm = z.infer<typeof ConsultationFormSchema>;
export type ConsultationAnswerForm = z.infer<
  typeof ConsultationAnswerFormSchema
>;
