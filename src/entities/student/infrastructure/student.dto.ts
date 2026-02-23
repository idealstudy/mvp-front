import { z } from 'zod';

/**
 * 학생 기본 정보 DTO
 * TODO nullable 확인
 */
const BasicInfoDtoSchema = z.object({
  name: z.string(),
  email: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string().nullable(),
});

/**
 * 학생 기본 정보 Payload
 */
const UpdateBasicInfoPayloadSchema = z.object({
  name: z.string(),
  isProfilePublic: z.boolean(),
  learningGoal: z.string(),
});

/**
 * 내보내기
 */
export const dto = {
  basicInfo: BasicInfoDtoSchema,
};

export const payload = {
  updateBasicInfo: UpdateBasicInfoPayloadSchema,
};
