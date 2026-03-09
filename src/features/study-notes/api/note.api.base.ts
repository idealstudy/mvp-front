import type {
  StudyNoteDetails,
  StudyNoteGroupPageable,
} from '@/features/study-notes/model';
import { api } from '@/shared/api';
import type { CommonResponse } from '@/types/http';

type Role = 'ROLE_TEACHER' | 'ROLE_STUDENT';

export interface NotesBaseApi<TList> {
  getNotes(args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
    keyword?: string;
  }): Promise<TList>;
  getNotesByGroup(args: {
    studyRoomId: number;
    teachingNoteGroupId: number;
    pageable: StudyNoteGroupPageable;
    keyword?: string;
  }): Promise<TList>;
  getDetail(teachingNoteId: number): Promise<StudyNoteDetails>;
}

export const createNotesBaseApi = <TList>(role: Role): NotesBaseApi<TList> => {
  // BFF에서 ROLE_* → teacher/student 변환 처리하지 않고 직접 처리하도록 수정
  const rolePath = role === 'ROLE_TEACHER' ? 'teacher' : 'student';

  const roomPath = (studyRoomId: number) =>
    `/${rolePath}/study-rooms/${studyRoomId}`;

  return {
    async getNotes({ studyRoomId, pageable, keyword }) {
      const res = await api.private.get<CommonResponse<TList>>(
        `${roomPath(studyRoomId)}/teaching-notes`,
        { params: { ...pageable, ...(keyword && { keyword }) } }
      );
      return res.data;
    },

    async getNotesByGroup({
      studyRoomId,
      teachingNoteGroupId,
      pageable,
      keyword,
    }) {
      const res = await api.private.get<CommonResponse<TList>>(
        `${roomPath(studyRoomId)}/teaching-note-groups/${teachingNoteGroupId}/teaching-notes`,
        { params: { ...pageable, ...(keyword && { keyword }) } }
      );
      return res.data;
    },

    async getDetail(teachingNoteId) {
      const res = await api.private.get<CommonResponse<StudyNoteDetails>>(
        `/public/teaching-notes/${teachingNoteId}`
      );
      return res.data;
    },
  };
};
