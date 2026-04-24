import { ParentHomeworkQueryKey, repository } from '@/entities/homework';
import { useQuery } from '@tanstack/react-query';

// 보호자 과제 상세 내용
export const useParentHomeworkDetail = (
  studentId: number,
  studyRoomId: number,
  homeworkId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ParentHomeworkQueryKey.detail(studentId, studyRoomId, homeworkId),
    queryFn: () =>
      repository.parent.getDetail(studentId, studyRoomId, homeworkId),
    enabled:
      enabled &&
      Number.isInteger(studentId) &&
      studentId > 0 &&
      Number.isInteger(studyRoomId) &&
      studyRoomId > 0 &&
      Number.isInteger(homeworkId) &&
      homeworkId > 0,
  });
};
