import { z } from 'zod';

/**
 * 학생 기본 정보 Domain 스키마
 * TODO nullable 확인 (선생님과 다름)
 */
const BasicInfoDomainSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string().nullable(),
  role: z.literal('ROLE_STUDENT'),
  profilePublicKorean: z.enum(['공개', '비공개']),
});

/**
 * 내보내기
 */
export const domain = {
  basicInfo: BasicInfoDomainSchema,
};
