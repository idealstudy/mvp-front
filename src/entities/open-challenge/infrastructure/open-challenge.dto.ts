import { z } from 'zod';

const IdSchema = z.union([z.string(), z.number()]).transform(String);

const ChallengeSubjectDtoSchema = z
  .union([
    z.enum(['MATH', 'KOREAN', 'ENGLISH', 'SCIENCE']),
    z.enum(['math', 'korean', 'english', 'science']),
    z.string(),
  ])
  .optional()
  .default('math');

const DifficultyDtoSchema = z
  .union([
    z.enum(['highest', 'high', 'middle', 'low']),
    z.enum(['최상', '상', '중', '하']),
    z.string(),
  ])
  .optional()
  .default('middle');

const ChallengeListItemDtoSchema = z.object({
  id: IdSchema,
  subject: ChallengeSubjectDtoSchema,
  difficulty: DifficultyDtoSchema,
  wrongAnswerRate: z.number().optional().default(0),
  title: z.string().optional().default('오픈 챌린지 문제'),
  sourceText: z.string().optional().default('출처 정보'),
  questionImageUrl: z.string().nullable().optional().default(null),
  participantCount: z.number().optional().default(0),
  passRate: z.number().optional().default(0),
});

const ChallengeDetailDtoSchema = ChallengeListItemDtoSchema.extend({
  topic: z.string().optional(),
  questionNumber: z.number().optional().default(1),
  questionText: z
    .string()
    .optional()
    .default('문제 이미지를 보고 답을 선택해 주세요.'),
  choices: z.array(z.string()).default([]),
  correctAnswer: z.string().optional(),
  type: z.string().nullable().optional(),
  isAiSupported: z.boolean().optional().default(true),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const AttemptDtoSchema = z.object({
  attemptId: IdSchema,
  status: z.string(),
});

const AnswerResultDtoSchema = z.object({
  isCorrect: z.boolean(),
  correctAnswer: z.string(),
  participantCount: z.number(),
  passRate: z.number(),
});

const ChallengeReviewDtoSchema = z.object({
  id: IdSchema.optional(),
  nickname: z.string().optional().default('익명'),
  subject: z.string().optional().default('수학'),
  content: z.string(),
  recommendCount: z.number().optional().default(0),
  isBest: z.boolean().optional().default(false),
});

const UserRankingDtoSchema = z.object({
  userId: IdSchema.optional(),
  nickname: z.string(),
  streakDays: z.number(),
  challengeCount: z.number(),
  correctRate: z.number(),
});

const StartAttemptPayloadSchema = z.object({
  challengeId: z.string().min(1),
});

const SubmitAnswerPayloadSchema = z.object({
  selectedAnswer: z.string().min(1),
});

const CreateReviewPayloadSchema = z.object({
  challengeId: z.string().min(1),
  attemptId: z.string().min(1),
  content: z.string().min(1),
});

const SubmitFeedbackPayloadSchema = z.object({
  attemptId: z.string().min(1),
  rating: z.number().min(1).max(5).optional().nullable(),
  comment: z.string().optional(),
});

export const dto = {
  listItem: ChallengeListItemDtoSchema,
  list: z.array(ChallengeListItemDtoSchema),
  detail: ChallengeDetailDtoSchema,
  attempt: AttemptDtoSchema,
  answerResult: AnswerResultDtoSchema,
  review: ChallengeReviewDtoSchema,
  reviews: z.array(ChallengeReviewDtoSchema),
  ranking: UserRankingDtoSchema,
  rankings: z.array(UserRankingDtoSchema),
};

export const payload = {
  startAttempt: StartAttemptPayloadSchema,
  submitAnswer: SubmitAnswerPayloadSchema,
  createReview: CreateReviewPayloadSchema,
  submitFeedback: SubmitFeedbackPayloadSchema,
};
