import { dto } from '@/entities/study-note/infrastructure';
import { sharedSchema } from '@/types';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 공통 응답 어댑터 (Void, ID반환)
 * EmptyDataSchema: 삭제, 수정 응답 (데이터 없음)
 * SuccessIdSchema: 생성, 복제 응답 (ID 반환)
 * ────────────────────────────────────────────────────*/
const NoteDeleteAdapter = sharedSchema.response(sharedSchema.empty);
const NoteCreateAdapter = sharedSchema.response(sharedSchema.successId);

/* ─────────────────────────────────────────────────────
 * 전체 수업노트조회 응답의 개별 아이템
 * ────────────────────────────────────────────────────*/
const NoteListAdapter = sharedSchema.response(z.array(dto.listItem));

/* ─────────────────────────────────────────────────────
 * 수업 노트 목록 조회 응답(Pagination 포함)
 * ────────────────────────────────────────────────────*/
const NoteListDataAdapter = sharedSchema.response(dto.listData);

/* ─────────────────────────────────────────────────────
 * 수업 노트 상세 내용 조회 응답
 * ────────────────────────────────────────────────────*/
const NoteDetailAdapter = sharedSchema.response(dto.detail);

/* ─────────────────────────────────────────────────────
 * 보호자 - 수업 노트 상세 내용 조회 응답
 * ────────────────────────────────────────────────────*/
const ParentNoteDetailAdapter = sharedSchema.response(dto.parentDetail);

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const adapters = {
  create: NoteCreateAdapter,
  delete: NoteDeleteAdapter,
  list: NoteListDataAdapter,
  listItem: NoteListAdapter,
  details: NoteDetailAdapter,
  parentDetails: ParentNoteDetailAdapter,
};
