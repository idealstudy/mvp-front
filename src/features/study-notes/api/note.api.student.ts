import { createNotesBaseApi } from '@/features/study-notes/api';
import type {
  StudyNote,
  StudyNoteMemberResponse,
} from '@/features/study-notes/model';
import { api } from '@/shared/api';
import type { PaginationMeta } from '@/types/http';

export type StudentListResp = PaginationMeta & { content: StudyNote[] };

export interface StudentNotesApi
  extends ReturnType<typeof createNotesBaseApi<StudentListResp>> {
  getMembers(args: {
    studyRoomId: number;
    page?: number;
    size?: number;
  }): Promise<StudyNoteMemberResponse>;
}

// NOTE: [학생 전용] 여기서 확장
export const createStudentNotesApi = () => ({
  ...createNotesBaseApi<StudentListResp>('ROLE_STUDENT'),
  async getMembers({
    studyRoomId,
    page = 0,
    size = 20,
  }: {
    studyRoomId: number;
    page?: number;
    size?: number;
  }) {
    return api.private.get(`/student/study-rooms/${studyRoomId}/members`, {
      params: { page, size },
    }) as Promise<StudyNoteMemberResponse>;
  },
});
