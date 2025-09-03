import { apiClient } from '@/lib/api';

// 수업노트 그룹 생성
export const postStudyNoteGroupInfinite = async ({
  studyRoomId,
  title,
}: {
  studyRoomId: number;
  title: string;
}) => {
  const response = await apiClient.post(`/api/teacher/teaching-note-groups`, {
    studyRoomId,
    title,
  });
  return response.data;
};

// 수업노트 그룹 수정
export const updateStudyNoteGroupInfinite = async ({
  teachingNoteGroupId,
  title,
}: {
  teachingNoteGroupId: number;
  title: string;
}) => {
  const response = await apiClient.put(
    `/api/teacher/teaching-note-groups/${teachingNoteGroupId}`,
    { title }
  );
  return response.data;
};

// 수업노트 그룹 삭제
export const deleteStudyNoteGroupInfinite = async ({
  teachingNoteGroupId,
}: {
  teachingNoteGroupId: number;
}) => {
  const response = await apiClient.delete(
    `/api/teacher/teaching-note-groups/${teachingNoteGroupId}`
  );
  return response.data;
};
