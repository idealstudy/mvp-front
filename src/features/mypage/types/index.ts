import { FrontendStudentBasicInfo } from '@/entities/student';
import { FrontendTeacherBasicInfo } from '@/entities/teacher';

// TODO Parent 추가
export type UserBasicInfo = FrontendTeacherBasicInfo | FrontendStudentBasicInfo;
