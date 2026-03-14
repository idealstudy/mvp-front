import { domain } from '@/entities/class-link/core';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto } from './class-link.dto';

export const classLinkRepository = {
  getList: async (studyRoomId: number) => {
    const response = await api.private.get(`/study-rooms/${studyRoomId}/links`);
    const data = unwrapEnvelope(response, dto.list);
    return domain.list.parse(data.links);
  },

  createClassLink: async (
    studyRoomId: number,
    body: { name: string; url: string }
  ) => {
    await api.private.post(`/teacher/study-rooms/${studyRoomId}/links`, body);
  },

  editClassLink: async (
    studyRoomId: number,
    linkId: number,
    body: { name: string; url: string }
  ) => {
    await api.private.put(
      `/teacher/study-rooms/${studyRoomId}/links/${linkId}`,
      body
    );
  },

  deleteClassLink: async (studyRoomId: number, linkId: number) => {
    await api.private.delete(
      `/teacher/study-rooms/${studyRoomId}/links/${linkId}`
    );
  },
};
