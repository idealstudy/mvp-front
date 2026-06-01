import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 오픈챌린지 과목 Domain
 * ────────────────────────────────────────────────────*/
const ChallengeSubjectSchema = z.enum(['MATH', 'KOREAN', 'ENGLISH', 'SCIENCE']);

/* ─────────────────────────────────────────────────────
 * 오픈챌린지 목록 / 상세 Domain
 * ────────────────────────────────────────────────────*/
const ChallengeListItemSchema = z.object({
  id: z.string(),
  subject: ChallengeSubjectSchema,
  difficulty: z.enum(['TOP', 'HIGH', 'MID', 'LOW']),
  title: z.string(),
  sourceText: z.string(),
  questionImageUrl: z.string().nullable(),
  passRate: z.number().nullable(),
  participantCount: z.number(),
});

const ChallengeDetailSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  questionNumber: z.number(),
  questionText: z.string(),
  questionImageUrl: z.string().nullable(),
  choices: z.array(z.string()),
  passRate: z.number().nullable(),
  wrongAnswerRate: z.number(),
  participantCount: z.number(),
  isAiSupported: z.boolean(),
});

/* ─────────────────────────────────────────────────────
 * 오픈챌린지 풀이 결과 Domain
 * ────────────────────────────────────────────────────*/
const ChallengeAnswerResultSchema = z.object({
  isCorrect: z.boolean(),
  correctAnswer: z.string(),
  participantCount: z.number(),
  passRate: z.number().nullable(),
});

/* ─────────────────────────────────────────────────────
 * 오픈챌린지 리뷰 Domain
 * ────────────────────────────────────────────────────*/
const ChallengeReviewSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  subject: z.string(),
  content: z.string(),
  recommendCount: z.number(),
  isBest: z.boolean(),
  isRecommendedByMe: z.boolean(),
});

const NextChallengeSchema = ChallengeListItemSchema;

/* ─────────────────────────────────────────────────────
 * 오픈챌린지 랭킹 Domain
 * ────────────────────────────────────────────────────*/
const UserRankingSchema = z.object({
  userId: z.string().optional(),
  nickname: z.string(),
  streakDays: z.number(),
  challengeCount: z.number(),
  correctRate: z.number(),
});

/* ─────────────────────────────────────────────────────
 * 마이페이지 오픈챌린지 Domain
 * ────────────────────────────────────────────────────*/
const MyChallengeListItemSchema = z.object({
  challengeId: z.string(),
  subject: ChallengeSubjectSchema,
  difficulty: z.enum(['TOP', 'HIGH', 'MID', 'LOW']),
  sourceText: z.string(),
  questionText: z.string(),
  questionImageUrl: z.string().nullable(),
  isCorrect: z.boolean().nullable(),
  usedAi: z.boolean(),
  completedAt: z.string(),
});

const MyChallengeAttemptSchema = z.object({
  attemptId: z.string(),
  status: z.enum(['IN_PROGRESS', 'AI_COACHING', 'UNRESOLVED', 'COMPLETED']),
  isCorrect: z.boolean().nullable(),
  selectedAnswer: z.string().nullable(),
  usedAi: z.boolean(),
  maxUsedHintStep: z.number().nullable(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});

const MyChallengeReviewSchema = z.object({
  reviewId: z.string(),
  content: z.string(),
  isActive: z.boolean(),
  recommendCount: z.number(),
});

const MyChallengeDetailSchema = z.object({
  challengeId: z.string(),
  attempts: z.array(MyChallengeAttemptSchema),
  reviews: z.array(MyChallengeReviewSchema),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const domain = {
  subject: ChallengeSubjectSchema,
  listItem: ChallengeListItemSchema,
  detail: ChallengeDetailSchema,
  answerResult: ChallengeAnswerResultSchema,
  review: ChallengeReviewSchema,
  nextChallenge: NextChallengeSchema,
  ranking: UserRankingSchema,
  myChallengeListItem: MyChallengeListItemSchema,
  myChallengeDetail: MyChallengeDetailSchema,
};
