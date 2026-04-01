import { z } from 'zod';

import { domain } from '../core';
import { dto } from '../infrastructure/preview.dto';

// Base DTO types
export type PreviewSchoolInfoDTO = z.infer<typeof dto.schoolInfo>;
export type PreviewReviewResolvedContentDTO = z.infer<
  typeof dto.reviewResolvedContent
>;
export type PreviewCharacteristicResolvedContentDTO = z.infer<
  typeof dto.characteristicResolvedContent
>;
export type PreviewReviewItemDTO = z.infer<typeof dto.reviewItem>;
export type PreviewConsultationItemDTO = z.infer<typeof dto.consultationItem>;
export type PreviewConsultationListDTO = z.infer<typeof dto.consultationList>;

// Main DTO types
export type PreviewCoreDTO = z.infer<typeof dto.core>;
export type PreviewMainDTO = z.infer<typeof dto.main>;
export type PreviewOtherStudyRoomItemDTO = z.infer<typeof dto.statsItem>;
export type PreviewSideDTO = z.infer<typeof dto.side>;

// Envelope DTO types
export type PreviewDetailEnvelopeDTO = z.infer<typeof dto.detailEnvelope>;
export type PreviewStatsEnvelopeDTO = z.infer<typeof dto.statsEnvelope>;

// Domain types (with Korean labels)
export type PreviewCore = z.infer<typeof domain.core>;
export type PreviewMain = z.infer<typeof domain.main>;
export type PreviewSideItem = z.infer<typeof domain.sideItem>;
export type PreviewSide = z.infer<typeof domain.side>;
export type PreviewConsultationItem = z.infer<typeof domain.consultationItem>;
export type PreviewConsultationList = z.infer<typeof domain.consultationList>;
