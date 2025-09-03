import { apiClient } from '@/lib/api';

// 수업노트 그룹 생성
export const postStudyNoteGroup = async ({
  studyRoomId,
  title,
}: {
  studyRoomId: number;
  title: string;
}) => {
  const response = await apiClient.post(`/teacher/teaching-note-groups`, {
    studyRoomId,
    title,
  });
  return response.data;
};

// 수업노트 그룹 수정
export const updateStudyNoteGroup = async ({
  teachingNoteGroupId,
  title,
}: {
  teachingNoteGroupId: number;
  title: string;
}) => {
  const response = await apiClient.put(
    `/teacher/teaching-note-groups/${teachingNoteGroupId}`,
    { title }
  );
  return response.data;
};

// 수업노트 그룹 삭제
export const deleteStudyNoteGroup = async ({
  teachingNoteGroupId,
}: {
  teachingNoteGroupId: number;
}) => {
  const response = await apiClient.delete(
    `/teacher/teaching-note-groups/${teachingNoteGroupId}`
  );
  return response.data;
};
