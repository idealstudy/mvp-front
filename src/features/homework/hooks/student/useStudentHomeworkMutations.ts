import { StudentHomeworkQueryKey, repository } from '@/entities/homework';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type PostStudentHomeworkPayload = {
  studyRoomId: number;
  homeworkId: number;
  content: string;
  mediaIds?: string[];
};
// 학생이 과제 제출
export const usePostStudentHomework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostStudentHomeworkPayload) =>
      repository.student.submit(payload.studyRoomId, payload.homeworkId, {
        content: payload.content,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: StudentHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};

type StudentHomeworkPayload = {
  studyRoomId: number;
  homeworkStudentId: number;
  homeworkId: number;
  content: string;
};

// 학생이 제출한 과제 삭제
export const useRemoveStudentHomework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studyRoomId, homeworkStudentId }: StudentHomeworkPayload) =>
      repository.student.deleteSubmission(studyRoomId, homeworkStudentId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: StudentHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};

// 학생이 제출한 과제 수정
export const useUpdateStudentHomework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkStudentId,
      content,
    }: StudentHomeworkPayload) =>
      repository.student.updateSubmission(studyRoomId, homeworkStudentId, {
        content,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: StudentHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};
