import { teacherKeys } from '@/entities/teacher';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  postTeacherHomeworkCreate,
  removeTeacherHomework,
  updateTeacherHomework,
} from '../../api/teacher/homework.teacher.api';
import { TeacherHomeworkRequest } from '../../model/homework.types';
import { TeacherHomeworkQueryKey } from '../../service/query-keys';

// 선생님이 과제 생성
export const useTeacherCreateHomework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      body,
    }: {
      studyRoomId: number;
      body: TeacherHomeworkRequest;
    }) => postTeacherHomeworkCreate(studyRoomId, body),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TeacherHomeworkQueryKey.listBase(variables.studyRoomId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...teacherKeys.dashboard.all(), 'homeworkList'],
      });
    },
  });
};

// 선생님이 과제 삭제
export const useTeacherRemoveHomework = () => {
  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkId,
    }: {
      studyRoomId: number;
      homeworkId: number;
    }) => removeTeacherHomework(studyRoomId, homeworkId),
  });
};

// 선생님이 과제 수정
export const useTeacherUpdateHomework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkId,
      body,
    }: {
      studyRoomId: number;
      homeworkId: number;
      body: TeacherHomeworkRequest;
    }) => updateTeacherHomework(studyRoomId, homeworkId, body),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: TeacherHomeworkQueryKey.listBase(variables.studyRoomId),
        }),
        queryClient.invalidateQueries({
          queryKey: TeacherHomeworkQueryKey.detail(
            variables.studyRoomId,
            variables.homeworkId
          ),
        }),
      ]);
    },
  });
};
