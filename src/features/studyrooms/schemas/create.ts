import { z } from 'zod';

const toPlainText = (node: unknown): string => {
  const buf: string[] = [];
  JSON.stringify(node, (k, v) => {
    if (k === 'text' && typeof v === 'string') buf.push(v);
    return v;
  });
  return buf.join('').trim();
};

export const CreateStudyRoomSchema = z.object({
  name: z.string().min(1, '스터디룸 이름을 입력해주세요.'),
  description: z.preprocess((val) => {
    if (typeof val === 'string') return val;
    return toPlainText(val);
  }, z.string().optional()),
  visibility: z.enum(['PUBLIC', 'PRIVATE'], {
    required_error: '공개 범위를 선택해주세요.',
  }),
  modality: z.enum(['ONLINE', 'OFFLINE'], {
    required_error: '수업 장소를 선택해주세요.',
  }),
  classForm: z.enum(['ONE_ON_ONE', 'ONE_TO_MANY'], {
    required_error: '수업 대상을 선택해주세요.',
  }),
  subjectType: z.enum(['KOREAN', 'ENGLISH', 'MATH', 'OTHER'], {
    required_error: '과목을 선택해주세요.',
  }),
  schoolInfo: z
    .object({
      schoolLevel: z.enum(['HIGH', 'MIDDLE', 'ELEMENTARY', 'OTHER'], {
        required_error: '학교를 선택해주세요.',
      }),
      grade: z.coerce.number().int().min(1, '학년을 선택해주세요.'),
    })
    .refine(
      ({ schoolLevel, grade }) => {
        if (schoolLevel === 'ELEMENTARY') return grade >= 1 && grade <= 6;
        return grade >= 1 && grade <= 3;
      },
      { message: '학년 범위가 올바르지 않습니다.', path: ['grade'] }
    ),
  emails: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().email('올바른 이메일을 입력해주세요.').optional()
  ),
});

export type StudyRoomFormValues = z.infer<typeof CreateStudyRoomSchema>;
