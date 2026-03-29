import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto } from './consultation.dto';

export const repository = {
  getList: async (
    studyRoomId: number,
    studentId: number,
    page = 0,
    size = 10
  ) => {
    const response = await api.private.get(
      `common/study-rooms/${studyRoomId}/consultation-sheets/${studentId}`,
      { params: { page, size } }
    );
    return unwrapEnvelope(response, dto.list);
  },

  getDetail: async (
    studyRoomId: number,
    studentId: number,
    sheetId: number
  ) => {
    const response = await api.private.get(
      `common/study-rooms/${studyRoomId}/consultation-sheets/${studentId}/${sheetId}`
    );
    return unwrapEnvelope(response, dto.item);
  },

  create: async (
    studyRoomId: number,
    studentId: number,
    body: {
      content: string;
      mediaIds?: string[];
    }
  ) => {
    await api.private.post(
      `teacher/study-rooms/${studyRoomId}/consultation-sheets/${studentId}`,
      body
    );
  },

  update: async (
    studyRoomId: number,
    studentId: number,
    sheetId: number,
    body: { content: string; mediaIds?: string[] }
  ) => {
    await api.private.put(
      `teacher/study-rooms/${studyRoomId}/consultation-sheets/${studentId}/${sheetId}`,
      body
    );
  },

  delete: async (studyRoomId: number, studentId: number, sheetId: number) => {
    await api.private.delete(
      `teacher/study-rooms/${studyRoomId}/consultation-sheets/${studentId}/${sheetId}`
    );
  },
};
