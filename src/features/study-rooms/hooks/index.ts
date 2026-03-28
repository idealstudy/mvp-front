import {
  studentStudyRoomApi,
  // teacherStudyRoomQueryOptions,
  // studentStudyRoomQueryOptions,
  teacherStudyRoomApi,
} from '@/features/study-rooms/api';
import { createStudentStudyRoomHooks } from '@/features/study-rooms/hooks/room.query.hooks.student';
import { createTeacherStudyRoomHooks } from '@/features/study-rooms/hooks/room.query.hooks.teacher';

export { useInvitationController } from '@/features/study-rooms/hooks/useInvitationController';
export {
  stepperReducer,
  createStepState,
} from '@/features/study-rooms/hooks/useStepperReducer';
export { useStepValidate } from '@/features/study-rooms/hooks/useStepValidate';

const studentHooks = createStudentStudyRoomHooks(studentStudyRoomApi);

const teacherHooks = createTeacherStudyRoomHooks(teacherStudyRoomApi);

export const { useStudentStudyRoomsQuery, useStudentStudyRoomDetailQuery } =
  studentHooks;

export const {
  useTeacherStudyRoomsQuery,
  useTeacherStudyRoomDetailQuery,
  useSearchInvitation,
  useCreateStudyRoom,
  useSendInvitation,
  useRemoveMember,
  useTerminateMember,
  useResumeMember,
} = teacherHooks;

export {
  useClassLinkListQuery,
  useCreateClassLink,
  useEditClassLink,
  useDeleteClassLink,
} from '@/features/study-rooms/hooks/use-class-link-query';
