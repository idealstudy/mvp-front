import { z } from 'zod';

import {
  studentNoteDto,
  studentNotePayload,
} from '../infrastructure/student-note.dto';

/* ─────────────────────────────────────────────────────
 * DTO (Response)
 * ────────────────────────────────────────────────────*/
export type StudentNoteTimerProgress = z.infer<
  typeof studentNoteDto.timer.progress
>;
export type StudentNoteTimerStartResponse = z.infer<
  typeof studentNoteDto.timer.startResponse
>;
export type StudentNoteMonthlyDTO = z.infer<
  typeof studentNoteDto.calendar.monthlyResponse
>;
export type StudentNoteMonthlyDailyItemDTO = z.infer<
  typeof studentNoteDto.calendar.monthlyDailyItemResponse
>;
export type StudentNoteDailyDTO = z.infer<
  typeof studentNoteDto.calendar.dailyResponse
>;
export type StudentNoteListResponse = z.infer<
  typeof studentNoteDto.crud.listResponse
>;
export type StudentNoteDetail = z.infer<typeof studentNoteDto.crud.detail>;
export type StudentNoteListItem = z.infer<
  typeof studentNoteDto.crud.listResponse
>['content'][number];

/* ─────────────────────────────────────────────────────
 * Payload (Request)
 * ────────────────────────────────────────────────────*/
export type StudentNoteWritePayload = z.infer<typeof studentNotePayload.write>;
export type StudentNoteMonthlyQuery = z.infer<
  typeof studentNotePayload.monthlyQuery
>;
export type StudentNoteDailyQuery = z.infer<
  typeof studentNotePayload.dailyQuery
>;
