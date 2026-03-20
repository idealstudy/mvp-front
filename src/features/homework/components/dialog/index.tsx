'use client';

import { useRouter } from 'next/navigation';

import {
  type DialogAction,
  type DialogState,
  StudyroomConfirmDialog,
} from '@/shared/components/dialog';
import { useRole } from '@/shared/hooks/use-role';
import { classifyHomeworkError, handleApiError } from '@/shared/lib/errors';

import { useRemoveStudentHomework } from '../../hooks/student/useStudentHomeworkMutations';
import { useDeleteTeacherHomeworkFeedback } from '../../hooks/teacher/useTeacherHomeworkFeedbackMutations';
import { useTeacherDeleteHomework } from '../../hooks/teacher/useTeacherHomeworkMutations';

export const HomeworkDialog = ({
  state,
  dispatch,
  studyRoomId,
  homeworkId,
  homeworkStudentId,
  content,
  onRefresh,
  onPushList,
}: {
  state: DialogState;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  homeworkId: number;
  homeworkStudentId?: number;
  content?: string;
  onRefresh?: () => void; // homework list에서 삭제 시 refresh
  onPushList?: () => void; // homework detail에서 삭제시 list로 이동
}) => {
  const router = useRouter();
  const { role } = useRole();
  const isTeacher = role === 'ROLE_TEACHER';

  const { mutate: removeTeacherHomework } = useTeacherDeleteHomework();
  const { mutate: removeFeedback } = useDeleteTeacherHomeworkFeedback();
  const { mutate: removeStudentHomework } = useRemoveStudentHomework();

  // 선생님 homework 삭제
  const handleHomeworkDelete = () => {
    if (!isTeacher) {
      return;
    }

    removeTeacherHomework(
      {
        studyRoomId,
        homeworkId,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'GO_TO_CONFIRM' });
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onContext: () => {
              dispatch({ type: 'CLOSE' });
              setTimeout(() => {
                router.replace(`/study-rooms/${studyRoomId}/homework`);
              }, 1500);
            },
            onAuth: () => {
              dispatch({ type: 'CLOSE' });
            },
            onUnknown: () => {
              dispatch({ type: 'CLOSE' });
            },
          });
        },
      }
    );
  };

  // homework 선생님 feedback 삭제
  const handleFeedbackDelete = () => {
    removeFeedback(
      {
        studyRoomId,
        homeworkId,
        homeworkStudentId: homeworkStudentId!,
        content,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE' });
          onRefresh?.();
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onContext: () => dispatch({ type: 'CLOSE' }),
            onAuth: () => dispatch({ type: 'CLOSE' }),
            onUnknown: () => dispatch({ type: 'CLOSE' }),
          });
        },
      }
    );
  };

  // 학생이 제출한 homework 삭제
  const handleStudentHomeworkDelete = () => {
    removeStudentHomework(
      {
        studyRoomId,
        homeworkId,
        homeworkStudentId: homeworkStudentId!,
        content: content!,
      },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE' });
          onRefresh?.();
        },
        onError: (error) => {
          handleApiError(error, classifyHomeworkError, {
            onContext: () => dispatch({ type: 'CLOSE' }),
            onAuth: () => dispatch({ type: 'CLOSE' }),
            onUnknown: () => dispatch({ type: 'CLOSE' }),
          });
        },
      }
    );
  };

  if (state.status !== 'open') return null;

  return (
    <>
      {state.scope === 'homework' && state.kind === 'delete' && (
        <StudyroomConfirmDialog
          type="delete"
          open
          dispatch={dispatch}
          onDelete={handleHomeworkDelete}
          title="과제를 삭제하시겠습니까?"
          description="삭제된 과제는 복구할 수 없습니다."
        />
      )}

      {state.scope === 'homework-feedback' && state.kind === 'delete' && (
        <StudyroomConfirmDialog
          type="delete"
          open
          dispatch={dispatch}
          onDelete={handleFeedbackDelete}
          title="피드백을 삭제하시겠습니까?"
          description="작성한 피드백이 영구적으로 삭제됩니다."
        />
      )}

      {state.scope === 'homework-student' && state.kind === 'delete' && (
        <StudyroomConfirmDialog
          type="delete"
          open
          dispatch={dispatch}
          onDelete={handleStudentHomeworkDelete}
          title="제출한 과제를 삭제하시겠습니까?"
          description="제출한 과제와 피드백이 영구적으로 삭제됩니다."
        />
      )}

      {state.kind === 'onConfirm' && (
        <StudyroomConfirmDialog
          type="confirm"
          open
          dispatch={dispatch}
          onRefresh={onRefresh}
          onConfirm={onPushList}
          description="과제가 삭제되었습니다."
        />
      )}
    </>
  );
};
