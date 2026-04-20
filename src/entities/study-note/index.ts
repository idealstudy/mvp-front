/* ─────────────────────────────────────────────────────
 * 스터디 노트 도메인 스키마(외부에서 사용할거)
 * ────────────────────────────────────────────────────*/
import { domain } from './core/note.domain.schema';
import { factory } from './core/note.factory';
import { adapters } from './infrastructure/note.adapters';
import { dto } from './infrastructure/note.dto.schema';

export const note = { domain, dto, adapters, factory };
export { repository, StudyNoteQueryKey } from './infrastructure';
export * from './types';
