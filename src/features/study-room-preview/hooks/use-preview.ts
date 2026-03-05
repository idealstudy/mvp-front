import {
  type PreviewMain,
  type PreviewSide,
  previewKeys,
  repository,
} from '@/entities/study-room-preview';
import { useQuery } from '@tanstack/react-query';

const FIVE_MINUTE = 1000 * 60 * 5;

// 스터디룸 프리뷰 side info
export const usePreviewSideInfo = (
  teacherId: number,
  selectedStudyRoomId: number
) =>
  useQuery<PreviewSide>({
    queryKey: previewKeys.side(teacherId, selectedStudyRoomId),
    queryFn: () =>
      repository.preview.getPreviewSide(teacherId, selectedStudyRoomId),
    staleTime: FIVE_MINUTE,
    enabled:
      Number.isInteger(teacherId) &&
      teacherId > 0 &&
      Number.isInteger(selectedStudyRoomId) &&
      selectedStudyRoomId > 0,
  });

// 스터디룸 프리뷰 main info
export const usePreviewMainInfo = (studyRoomId: number) =>
  useQuery<PreviewMain>({
    queryKey: previewKeys.main(studyRoomId),
    queryFn: () => repository.preview.getPreviewMain(studyRoomId),
    staleTime: FIVE_MINUTE,
  });
