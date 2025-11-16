import type {
  StudyNoteDetails,
  StudyNoteGroupPageable,
} from '@/features/study-notes/model';
import { api } from '@/shared/api';
import type { CommonResponse } from '@/types/http';

type Role = 'ROLE_TEACHER' | 'ROLE_STUDENT';
const rolePathMap: Record<Role, 'teacher' | 'student'> = {
  ROLE_TEACHER: 'teacher',
  ROLE_STUDENT: 'student',
};

export interface NotesBaseApi<TList> {
  getNotes(args: {
    studyRoomId: number;
    pageable: StudyNoteGroupPageable;
  }): Promise<TList>;
  getNotesByGroup(args: {
    studyRoomId: number;
    teachingNoteGroupId: number;
    pageable: StudyNoteGroupPageable;
  }): Promise<TList>;
  getDetail(teachingNoteId: number): Promise<StudyNoteDetails>;
}

export const createNotesBaseApi = <TList>(role: Role): NotesBaseApi<TList> => {
  const rolePath = rolePathMap[role];
  const roomPath = (studyRoomId: number) =>
    `/${rolePath}/study-rooms/${studyRoomId}`;

  return {
    async getNotes({ studyRoomId, pageable }) {
      const res = await api.private.get<CommonResponse<TList>>(
        `${roomPath(studyRoomId)}/teaching-notes`,
        { params: pageable }
      );
      return res.data;
    },

    async getNotesByGroup({ studyRoomId, teachingNoteGroupId, pageable }) {
      const res = await api.private.get<CommonResponse<TList>>(
        `${roomPath(studyRoomId)}/teaching-note-groups/${teachingNoteGroupId}/teaching-notes`,
        { params: pageable }
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
