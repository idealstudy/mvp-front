import { domain } from '@/entities/open-challenge/core';
import {
  params,
  payload,
} from '@/entities/open-challenge/infrastructure/open-challenge.dto';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * Frontend Type
 * ────────────────────────────────────────────────────*/
export type ChallengeSubject = z.infer<typeof domain.subject>;
export type ChallengeListItem = z.infer<typeof domain.listItem>;
export type ChallengeDetail = z.infer<typeof domain.detail>;
export type ChallengeAnswerResult = z.infer<typeof domain.answerResult>;
export type ChallengeReview = z.infer<typeof domain.review>;
export type NextChallenge = z.infer<typeof domain.nextChallenge>;
export type UserRanking = z.infer<typeof domain.ranking>;
export type MyChallengeListItem = z.infer<typeof domain.myChallengeListItem>;
export type MyChallengeDetail = z.infer<typeof domain.myChallengeDetail>;

/* ─────────────────────────────────────────────────────
 * AI 코칭 Type
 * ────────────────────────────────────────────────────*/
export type AiCoachingSessionStatus =
  | 'READY'
  | 'COACHING'
  | 'WAITING_ANSWER'
  | 'GUIDE_TO_PROBLEM'
  | 'FINISHED'
  | 'ABANDONED';

export type AiCoachingMessageRole = 'STUDENT' | 'ASSISTANT' | 'SYSTEM';

export type AiCoachingEnumOption = {
  code: string;
  label: string;
};

export type AiCoachingEnums = {
  learningStage: AiCoachingEnumOption[];
  learningGoal: AiCoachingEnumOption[];
  difficultArea: AiCoachingEnumOption[];
};

export type AiCoachingPreference = {
  learningStage?: AiCoachingEnumOption | null;
  learningGoal?: AiCoachingEnumOption | null;
  difficultAreas: AiCoachingEnumOption[];
  customText?: string | null;
  modDate?: string | null;
} | null;

export type AiCoachingSession = {
  sessionId: string;
  status: AiCoachingSessionStatus;
  startedAt?: string | null;
};

export type AiCoachingMessage = {
  role: AiCoachingMessageRole;
  content: string;
  progressionStep?: number | null;
  regDate?: string | null;
};

export type AiCoachingMessageResponse = {
  sessionId: string;
  studentMessageId: string;
  assistantMessageId: string;
  reply: string;
  progressionStep?: number | null;
  status: AiCoachingSessionStatus;
  maxUsedHintStep?: number | null;
};

/* ─────────────────────────────────────────────────────
 * Query Params
 * ────────────────────────────────────────────────────*/
export type ChallengeListParams = {
  subject?: ChallengeSubject | 'ALL';
  difficulty?: 'highest' | 'high' | 'middle' | 'low' | 'ALL';
  sort?: 'latest' | 'popular';
  page?: number;
  size?: number;
};

export type ChallengeReviewSort = 'recommend' | 'latest';

export type MyChallengeResultFilter = z.infer<
  typeof params.myChallengeResultFilter
>;

export type MyChallengeListParams = {
  result?: MyChallengeResultFilter;
  page?: number;
  size?: number;
};

/* ─────────────────────────────────────────────────────
 * 관리자 Type
 * ────────────────────────────────────────────────────*/
export type AdminChallengeSubject = 'MATH' | 'KOREAN' | 'ENGLISH' | 'SCIENCE';
export type AdminChallengeDifficulty = 'TOP' | 'HIGH' | 'MID' | 'LOW';

export type ChallengeAttempt = {
  attemptId: string;
  status: string;
};

export type AdminChallengeDetail = {
  id: string;
  subject: AdminChallengeSubject;
  difficulty: AdminChallengeDifficulty;
  wrongAnswerRate: number;
  title: string;
  sourceText: string;
  questionText: string;
  questionImageUrl: string | null;
  choices: string[];
  correctAnswer: string;
  type: string;
  participantCount: number;
  passRate: number | null;
};

/* ─────────────────────────────────────────────────────
 * Payload
 * ────────────────────────────────────────────────────*/
export type StartChallengeAttemptPayload = z.infer<typeof payload.startAttempt>;
export type SubmitChallengeAnswerPayload = z.infer<typeof payload.submitAnswer>;
export type CreateChallengeReviewPayload = z.infer<typeof payload.createReview>;
export type SubmitChallengeFeedbackPayload = z.infer<
  typeof payload.submitFeedback
>;
export type AdminChallengePayload = z.infer<typeof payload.adminChallenge>;
export type AiCoachingPreferencePayload = z.infer<
  typeof payload.aiCoachingPreference
>;
export type CreateAiCoachingSessionPayload = z.infer<
  typeof payload.createAiCoachingSession
>;
export type SendAiCoachingMessagePayload = z.infer<
  typeof payload.sendAiCoachingMessage
>;
