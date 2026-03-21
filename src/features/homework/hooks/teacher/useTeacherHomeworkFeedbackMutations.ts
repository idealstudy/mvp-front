import { TeacherHomeworkQueryKey, repository } from '@/entities/homework';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type TeacherHomeworkFeedbackPayload = {
  studyRoomId: number;
  homeworkId: number;
  homeworkStudentId: number;
  content?: string;
  mediaIds?: string[];
};

// 선생님이 피드백 생성
export const usePostTeacherHomeworkFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkStudentId,
      content,
    }: TeacherHomeworkFeedbackPayload) =>
      repository.teacher.feedback.create(studyRoomId, homeworkStudentId, {
        content: content!,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TeacherHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};

// 선생님이 피드백 수정
export const useUpdateTeacherHomeworkFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkStudentId,
      content,
    }: TeacherHomeworkFeedbackPayload) =>
      repository.teacher.feedback.update(studyRoomId, homeworkStudentId, {
        content: content!,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TeacherHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};

// 선생님이 피드백 삭제
export const useDeleteTeacherHomeworkFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studyRoomId,
      homeworkStudentId,
    }: TeacherHomeworkFeedbackPayload) =>
      repository.teacher.feedback.delete(studyRoomId, homeworkStudentId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TeacherHomeworkQueryKey.detail(
          variables.studyRoomId,
          variables.homeworkId
        ),
      });
    },
  });
};
