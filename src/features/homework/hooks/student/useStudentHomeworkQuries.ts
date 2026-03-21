import { StudentHomeworkQueryKey, repository } from '@/entities/homework';
import type { HomeworkPageable } from '@/entities/homework/types';
import { useQuery } from '@tanstack/react-query';

// 학생 과제 리스트
export const useGetStudentHomeworkList = (
  studyRoomId: number,
  query: HomeworkPageable
) => {
  return useQuery({
    queryKey: StudentHomeworkQueryKey.list(studyRoomId, query),
    queryFn: () => repository.student.getList(studyRoomId, query),
    enabled: !!studyRoomId,
  });
};

// 학생 과제 상세 내용
export const useStudentHomeworkDetail = (
  studyRoomId: number,
  homeworkId: number
) => {
  return useQuery({
    queryKey: StudentHomeworkQueryKey.detail(studyRoomId, homeworkId),
    queryFn: () => repository.student.getDetail(studyRoomId, homeworkId),
    enabled: !!studyRoomId && !!homeworkId,
  });
};
