import { domain } from '@/entities/student/core';
import {
  FrontendStudentBasicInfo,
  StudentBasicInfoDTO,
  UpdateStudentBasicInfoPayload,
} from '@/entities/student/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { dto, payload } from './student.dto';

/**
 * isProfilePublic -> 한글 변환 헬퍼
 */
const getProfilePublicKorean = (isPublic: boolean): '공개' | '비공개' =>
  isPublic ? '공개' : '비공개';

/**
 * DTO를 Domain 객체로 변환
 */
const transformBasicInfoToFrontend = (
  basicInfoDto: StudentBasicInfoDTO
): FrontendStudentBasicInfo =>
  domain.basicInfo.parse({
    name: basicInfoDto.name,
    email: basicInfoDto.email,
    isProfilePublic: basicInfoDto.isProfilePublic,
    learningGoal: basicInfoDto.learningGoal,
    role: 'ROLE_STUDENT' as const,
    profilePublicKorean: getProfilePublicKorean(basicInfoDto.isProfilePublic),
  });

/**
 * [Read] 학생 기본 정보 조회
 */
const getBasicInfo = async (): Promise<FrontendStudentBasicInfo> => {
  const response = await api.private.get<CommonResponse<StudentBasicInfoDTO>>(
    '/student/me/basic-info'
  );

  const basicInfoDto = unwrapEnvelope(response, dto.basicInfo);

  return transformBasicInfoToFrontend(basicInfoDto);
};

/**
 * [Update] 학생 기본 정보 변경
 */
const updateBasicInfo = async (
  basicInfo: UpdateStudentBasicInfoPayload
): Promise<void> => {
  const validated = payload.updateBasicInfo.parse(basicInfo);
  await api.private.patch('/student/me/basic-info', validated);
};

/**
 * export
 */
export const repository = {
  basicInfo: {
    getBasicInfo,
    updateBasicInfo,
  },
};
