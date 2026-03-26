import { extractTextFromTiptapJSON } from '@/features/homework/hooks/use-homework-form-control';
import { hasNonTextContent } from '@/shared/lib';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const HomeworkFeedbackFormSchema = z.object({
  studyRoomId: z.number({ required_error: '스터디룸을 선택해 주세요!' }),

  homeworkStudentId: z.number({
    required_error: '피드백할 학생의 과제를 선택해 주세요!',
  }),
  homeworkId: z.number({
    required_error: '과제를 선택해 주세요!',
  }),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    if (!val || !val.content || val.content.length === 0) {
      return;
    }

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

// 학생이 과제 제출
export const StudentHomeworkFormSchema = z.object({
  studyRoomId: z.number({ required_error: '스터디룸을 선택해 주세요!' }),
  homeworkId: z.number({
    required_error: '과제를 선택해 주세요!',
  }),
  content: z.custom<JSONContent>().superRefine((val, ctx) => {
    if (!val || !val.content || val.content.length === 0) {
      return;
    }

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

export type HomeworkFeedbackForm = z.infer<typeof HomeworkFeedbackFormSchema>;
export type StudentHomeworkForm = z.infer<typeof StudentHomeworkFormSchema>;
