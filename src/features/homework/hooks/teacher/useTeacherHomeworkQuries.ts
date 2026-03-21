import { TeacherHomeworkQueryKey, repository } from '@/entities/homework';
import type { HomeworkPageable } from '@/entities/homework/types';
import { useQuery } from '@tanstack/react-query';

// 과제 리스트를 불러옴
export const useGetTeacherHomeworkList = (
  studyRoomId: number,
  query: HomeworkPageable
) => {
  return useQuery({
    queryKey: TeacherHomeworkQueryKey.list(studyRoomId, query),
    queryFn: () => repository.teacher.getList(studyRoomId, query),
    enabled: !!studyRoomId,
  });
};

// 과제 상세내용을 불러옴
export const useGetTeacherHomeworkDetail = (
  studyRoomId: number,
  homeworkId: number
) => {
  return useQuery({
    queryKey: TeacherHomeworkQueryKey.detail(studyRoomId, homeworkId),
    queryFn: () => repository.teacher.getDetail(studyRoomId, homeworkId),
    enabled: !!studyRoomId && !!homeworkId,
    staleTime: 0,
  });
};
