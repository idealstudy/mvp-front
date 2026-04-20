import { StudyNoteGroupPageable } from '@/features/study-notes/model';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse, EmptyData, PaginationData } from '@/types';
import type { SuccessId } from '@/types';

import { factory } from '../core/note.factory';
import type {
  NoteDetail,
  NoteDomain,
  NoteListItem,
  NoteRequest,
  ParentNoteDetail,
} from '../types/note.types';
import { adapters } from './note.adapters';
import { dto } from './note.dto.schema';

/* ─────────────────────────────────────────────────────
 * TODO: Role 리포지토리가 생성될 때 외부에서 주입작업 필요
 * ────────────────────────────────────────────────────*/
const ROLE: 'teacher' = 'teacher' as const;
const TEACHER_PATH = (studyRoomId: number) =>
  `/${ROLE}/study-rooms/${studyRoomId}`;
const TEACHING_NOTE_PATH = (teachingNoteId: number) =>
  `/teacher/teaching-notes/${teachingNoteId}`;

/* ─────────────────────────────────────────────────────
 * 수업 노트 생성
 * 리포지토리는 DTO || 팩토리를 거쳐 도메인 객체를 반환해야 하지만
 * 생성 API는 ID를 반환하므로 DTO 타입 그대로 반환
 * ────────────────────────────────────────────────────*/
const createNote = async (dto: NoteRequest): Promise<SuccessId> => {
  const response = await api.private.post<CommonResponse<SuccessId>>(
    `/teacher/teaching-notes`,
    dto
  );
  const validatedResponse = adapters.create.parse(response.data);
  return validatedResponse.data;
};

/* ─────────────────────────────────────────────────────
 * 수업 노트 수정
 * ────────────────────────────────────────────────────*/
const updateNote = async (
  teachingNoteId: number,
  dto: NoteRequest
): Promise<void> => {
  const response = await api.private.put<CommonResponse<EmptyData>>(
    TEACHING_NOTE_PATH(teachingNoteId),
    dto
  );
  adapters.delete.parse(response.data);
};

/* ─────────────────────────────────────────────────────
 * 수업 노트 삭제
 * ────────────────────────────────────────────────────*/
const deleteNote = async (teachingNoteId: number): Promise<void> => {
  const response = await api.private.delete<CommonResponse<EmptyData>>(
    TEACHING_NOTE_PATH(teachingNoteId)
  );
  adapters.delete.parse(response.data);
};

/* ─────────────────────────────────────────────────────
 * 수업 노트 목록 조회 응답(Pagination 포함)
 * ────────────────────────────────────────────────────*/
const getNoteList = async ({
  studyRoomId,
  pageable,
}: {
  studyRoomId: number;
  pageable: StudyNoteGroupPageable;
}): Promise<PaginationData<NoteDomain>> => {
  const response = await api.private.get<
    CommonResponse<PaginationData<NoteListItem>>
  >(`${TEACHER_PATH(studyRoomId)}/teaching-notes`, { params: pageable });
  const validatedListResponse = adapters.list.parse(response.data);
  const domainContent = factory.fromList(validatedListResponse.data.content);

  return {
    ...response.data,
    content: domainContent,
  };
};

/* ─────────────────────────────────────────────────────
 * 수업 노트 상세 내용 조회
 * ────────────────────────────────────────────────────*/
const getNoteDetail = async (teachingNoteId: number): Promise<NoteDomain> => {
  const response = await api.private.get<CommonResponse<NoteDetail>>(
    `/common/teaching-notes/${teachingNoteId}`
  );
  const validatedResponse = adapters.details.parse(response.data);
  return factory.fromDetail(validatedResponse.data);
};

const getParentNoteDetail = async (
  studentId: number,
  teachingNoteId: number
): Promise<ParentNoteDetail> => {
  const response = await api.private.get<CommonResponse<ParentNoteDetail>>(
    `/parent/student/${studentId}/teaching-notes/${teachingNoteId}`
  );

  return unwrapEnvelope(response, dto.parentDetail);
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const repository = {
  create: createNote,
  update: updateNote,
  delete: deleteNote,
  getList: getNoteList,
  getDetail: getNoteDetail,
  getParentDetail: getParentNoteDetail,
};
