import {
  FrontendParentProfile,
  FrontendStudentProfile,
  FrontendTeacherProfile,
  ProfileWithMeta,
} from '@/entities/profile';

export function isTeacherProfile(
  profile: ProfileWithMeta
): profile is FrontendTeacherProfile & { id: string; role: 'ROLE_TEACHER' } {
  return profile.role === 'ROLE_TEACHER' && 'teacherNoteCount' in profile;
}

export function isStudentProfile(
  profile: ProfileWithMeta
): profile is FrontendStudentProfile & { id: string; role: 'ROLE_STUDENT' } {
  return profile.role === 'ROLE_STUDENT' && 'learningGoal' in profile;
}

export function isParentProfile(
  profile: ProfileWithMeta
): profile is FrontendParentProfile & { id: string; role: 'ROLE_PARENT' } {
  return profile.role === 'ROLE_PARENT';
}
