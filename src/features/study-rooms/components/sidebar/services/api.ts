// 수업노트 그룹 생성
import type {
  StudyRoomDetail,
  StudyRoomSubmitValues,
} from '@/features/study-rooms/model';
import { api } from '@/shared/api';

export const createStudyNoteGroup = async (params: {
  studyRoomId: number;
  title: string;
}) => {
  return await api.private.post(`/teacher/teaching-note-groups`, params);
};
// 수업노트 그룹 수정
export const updateStudyNoteGroup = async ({
  teachingNoteGroupId,
  title,
}: {
  teachingNoteGroupId: number;
  title: string;
}) => {
  return await api.private.put(
    `/teacher/teaching-note-groups/${teachingNoteGroupId}`,
    { title }
  );
};

// 수업노트 그룹 삭제
export const deleteStudyNoteGroup = async ({
  teachingNoteGroupId,
}: {
  teachingNoteGroupId: number;
}) => {
  return await api.private.delete(
    `/teacher/teaching-note-groups/${teachingNoteGroupId}`
  );
};

// 스터디룸 제목 변경
export const updateStudyRoomTitle = async ({
  studyRoomId,
  others,
  name,
}: {
  studyRoomId: number;
  others: StudyRoomDetail;
  name: string;
}) => {
  return await api.private.put(`/teacher/study-rooms/${studyRoomId}`, {
    ...others,
    name,
  });
};

export const updateStudyRoom = async ({
  studyRoomId,
  others,
}: {
  studyRoomId: number;
  others: StudyRoomSubmitValues;
}) => {
  return await api.private.put(`/teacher/study-rooms/${studyRoomId}`, {
    ...others,
  });
};

export const deleteStudyRoom = async ({
  studyRoomId,
}: {
  studyRoomId: number;
}) => {
  return await api.private.delete(`/teacher/study-rooms/${studyRoomId}`);
};
