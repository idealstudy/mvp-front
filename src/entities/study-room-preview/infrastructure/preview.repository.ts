import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { domain } from '../core';
import type { PreviewMain, PreviewSide } from '../types';

const getPreviewSide = async (
  teacherId: number,
  selectedStudyRoomId: number
): Promise<PreviewSide> => {
  const response = await api.public.get(`/public/study-rooms/${teacherId}`, {
    params: { selectedStudyRoomId },
  });
  const side = unwrapEnvelope(response, domain.side);

  const isMatchedSelectedRoom =
    side.id === selectedStudyRoomId ||
    side.otherStudyRooms.some((room) => room.id === selectedStudyRoomId);

  if (!isMatchedSelectedRoom) {
    throw new Error('스터디룸과 선생님 정보가 일치하지 않습니다.');
  }

  return side;
};

const getPreviewMain = async (studyRoomId: number): Promise<PreviewMain> => {
  const response = await api.public.get(
    `/public/study-rooms/${studyRoomId}/preview`
  );
  return unwrapEnvelope(response, domain.main);
};

export const repository = {
  preview: {
    getPreviewSide,
    getPreviewMain,
  },
};
