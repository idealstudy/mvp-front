'use client';

import { useReducer } from 'react';

import { ParentHomeworkDetail } from '@/features/homework/components/detail/parent-homework-detail';
import { StudentHomeworkDetail } from '@/features/homework/components/detail/student-homework-detail';
import { TeacherHomeworkDetail } from '@/features/homework/components/detail/teacher-homework-detail';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { MiniSpinner } from '@/shared/components/loading';
import { useRole } from '@/shared/hooks';

type Props = {
  studyRoomId: number;
  homeworkId: number;
  studentId: number;
};

export default function HomeworkDetailRoleSwitch({
  studyRoomId,
  homeworkId,
  studentId,
}: Props) {
  const { role, isLoading: isRoleLoading } = useRole();
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  if (isRoleLoading) return <MiniSpinner />;

  if (role === 'ROLE_TEACHER') {
    return (
      <TeacherHomeworkDetail
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        dialog={dialog}
        dispatch={dispatch}
      />
    );
  }

  if (role === 'ROLE_PARENT') {
    return (
      <ParentHomeworkDetail
        studentId={studentId}
        studyRoomId={studyRoomId}
        homeworkId={homeworkId}
        dialog={dialog}
        dispatch={dispatch}
      />
    );
  }

  return (
    <StudentHomeworkDetail
      studyRoomId={studyRoomId}
      homeworkId={homeworkId}
      dialog={dialog}
      dispatch={dispatch}
    />
  );
}
