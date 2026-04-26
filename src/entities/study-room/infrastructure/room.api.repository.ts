import type {
  StudentRoomListItemDTO,
  TeacherRoomDetail,
  TeacherRoomDetailDTO,
  TeacherRoomListItemDTO,
} from '@/entities/study-room/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';
import { CommonResponse } from '@/types';

import { factory } from '../core/room.factory';
import type { Room, StudentRoom } from '../types';
import { adapters } from './room.adapters';
import { dto } from './room.dto.schema';

export const studyRoomRepository = {
  /* ─────────────────────────────────────────────────────
   * 공용
   * ────────────────────────────────────────────────────*/
  getDetail: async (id: number): Promise<TeacherRoomDetail> => {
    const response = await api.private.get<
      CommonResponse<TeacherRoomDetailDTO>
    >(`/study-rooms/${id}`);
    const parsed = adapters.teacher.detail.parse(response.data);
    return factory.teacher.detail(parsed.data);
  },

  getInvitationInfo: async (token: string) => {
    const response = await api.public.get<{ data: unknown }>(
      `/public/study-rooms/invitation?token=${token}`
    );
    return dto.invitationInfo.parse(response.data);
  },

  /* ─────────────────────────────────────────────────────
   * 선생님
   * ────────────────────────────────────────────────────*/
  teacher: {
    getList: async (): Promise<Room[]> => {
      const response =
        await api.private.get<CommonResponse<TeacherRoomListItemDTO>>(
          `/teacher/study-rooms`
        );
      const parsed = adapters.teacher.list.parse(response.data);
      return factory.teacher.list(parsed.data);
    },

    getInvitationToken: async (studyRoomId: number) => {
      const response = await api.private.get(
        `/teacher/study-rooms/${studyRoomId}/invitation`
      );
      return unwrapEnvelope(response, dto.teacher.inviteToken);
    },

    toggleInvitation: async (studyRoomId: number, enabled: boolean) => {
      const response = await api.private.put(
        `/teacher/study-rooms/${studyRoomId}/invitation`,
        {
          enabled,
        }
      );
      return unwrapEnvelope(response, dto.teacher.inviteToken);
    },

    updateThumbnail: async (
      studyRoomId: number,
      thumbnailMediaId: string | null
    ) => {
      const response = await api.private.patch(
        `/teacher/study-rooms/${studyRoomId}/thumbnail`,
        { thumbnailMediaId }
      );
      return unwrapEnvelope(response, dto.teacher.thumbnailResponse);
    },
  },

  /* ─────────────────────────────────────────────────────
   * 학생
   * ────────────────────────────────────────────────────*/
  student: {
    getList: async (): Promise<StudentRoom[]> => {
      const response =
        await api.private.get<CommonResponse<StudentRoomListItemDTO>>(
          `/student/study-rooms`
        );
      const parsed = adapters.student.list.parse(response.data);
      return factory.student.list(parsed.data);
    },
    acceptInvitation: async (token: string) => {
      const response = await api.private.post<{ data: unknown }>(
        `/student/study-room-invites/${token}/respond`
      );
      return dto.student.inviteRespond.parse(response.data);
    },
  },
};
