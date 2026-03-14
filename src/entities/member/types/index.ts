import { domain, dto } from '@/entities/member';
import { FrontendStudentBasicInfo } from '@/entities/student';
import { FrontendTeacherBasicInfo } from '@/entities/teacher';
import { z } from 'zod';

export type MemberDTO = z.infer<typeof dto.schema>;
export type Role = z.infer<typeof dto.role>;
export type FrontendMember = z.infer<typeof domain.schema>;

// TODO Parent 추가
export type UserBasicInfo = FrontendTeacherBasicInfo | FrontendStudentBasicInfo;
