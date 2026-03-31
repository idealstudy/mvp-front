import { studentQo, teacherQo } from '@/features/study-notes/api';
import { createTeacherStudyNoteMutations } from '@/features/study-notes/hooks/hooks.mutation.factory';
import {
  createStudentStudyNoteHooks,
  createTeacherStudyNoteHooks,
} from '@/features/study-notes/hooks/hooks.query.factory';

export * from '@/features/study-notes/hooks/use-member-filter';

// 훅 객체 생성
export const studentHooks = createStudentStudyNoteHooks(studentQo);
export const teacherQueryHooks = createTeacherStudyNoteHooks(teacherQo);
export const teacherMutationHooks = createTeacherStudyNoteMutations();

// export hook
export const {
  useGetStudentNotesList,
  useGetStudentNotesByGroup,
  useGetStudentNoteDetail,
  useGetStudentNoteMembers,
} = studentHooks;

export const {
  useGetTeacherNotesList,
  useGetTeacherNotesByGroup,
  useGetTeacherNoteDetail,
  useGetTeacherNoteMembers,
} = teacherQueryHooks;

export const {
  useUpdateStudyNote,
  useMoveNoteToGroup,
  useRemoveNoteFromGroup,
  useRemoveStudyNote,
} = teacherMutationHooks;
