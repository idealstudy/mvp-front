import { z } from 'zod';

const IdSchema = z.union([z.string(), z.number()]).transform(String);
const QUESTION_TEXT_FALLBACK = '문제 이미지를 보고 답을 선택해 주세요.';

const NullableNumberSchema = z.number().nullable().optional();

const ChallengeSubjectDtoSchema = z
  .union([
    z.enum(['MATH', 'KOREAN', 'ENGLISH', 'SCIENCE']),
    z.enum(['math', 'korean', 'english', 'science']),
    z.string(),
  ])
  .optional()
  .default('math');

const AdminChallengeSubjectSchema = z.enum([
  'MATH',
  'KOREAN',
  'ENGLISH',
  'SCIENCE',
]);

const DifficultyDtoSchema = z
  .union([
    z.enum(['highest', 'high', 'middle', 'low']),
    z.enum(['최상', '상', '중', '하']),
    z.string(),
  ])
  .optional()
  .default('middle');

const AdminChallengeDifficultySchema = z.enum(['TOP', 'HIGH', 'MID', 'LOW']);

const ChallengeListItemDtoSchema = z.object({
  id: IdSchema.optional(),
  challengeId: IdSchema.optional(),
  subject: ChallengeSubjectDtoSchema,
  difficulty: DifficultyDtoSchema,
  wrongAnswerRate: z.number().optional().default(0),
  title: z.string().optional().default('오픈챌린지 문제'),
  sourceText: z.string().optional().default('출처 정보'),
  questionText: z.string().nullable().optional(),
  questionImageUrl: z.string().nullable().optional().default(null),
  participantCount: z.number().optional().default(0),
  passRate: NullableNumberSchema,
});

const ChallengeDetailDtoSchema = ChallengeListItemDtoSchema.extend({
  topic: z.string().optional(),
  questionNumber: z.number().optional().default(1),
  questionText: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? QUESTION_TEXT_FALLBACK),
  choices: z.array(z.string()).default([]),
  correctAnswer: z.string().optional(),
  type: z.string().nullable().optional(),
  aiSupported: z.boolean().optional(),
  isAiSupported: z.boolean().optional().default(true),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const AttemptDtoSchema = z.object({
  attemptId: IdSchema,
  status: z.string(),
});

const AnswerResultDtoSchema = z
  .object({
    isCorrect: z.boolean().optional(),
    correct: z.boolean().optional(),
    correctAnswer: z.string(),
    participantCount: z.number(),
    passRate: z.number().nullable().optional(),
  })
  .transform((value) => ({
    isCorrect: value.isCorrect ?? value.correct ?? false,
    correctAnswer: value.correctAnswer,
    participantCount: value.participantCount,
    passRate: value.passRate ?? null,
  }));

const ChallengeReviewDtoSchema = z.object({
  id: IdSchema.optional(),
  reviewId: IdSchema.optional(),
  nickname: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? '익명'),
  subject: z.string().optional().default('수학'),
  content: z.string(),
  recommendCount: z.number().optional().default(0),
  isBest: z.boolean().optional(),
  best: z.boolean().optional(),
  isRecommendedByMe: z.boolean().optional(),
  recommendedByMe: z.boolean().optional().default(false),
});

const UserRankingDtoSchema = z.object({
  userId: IdSchema.optional(),
  nickname: z.string(),
  streakDays: z.number(),
  challengeCount: z.number(),
  correctRate: z.number(),
});

const MyChallengeResultFilterSchema = z.enum(['ALL', 'CORRECT', 'WRONG']);

const MyChallengeListItemDtoSchema = z.object({
  challengeId: IdSchema,
  subject: ChallengeSubjectDtoSchema,
  difficulty: AdminChallengeDifficultySchema,
  sourceText: z.string().optional().default('출처 정보'),
  questionText: z.string().nullable().optional(),
  questionImageUrl: z.string().nullable().optional().default(null),
  isCorrect: z.boolean().nullable(),
  usedAi: z.boolean().optional().default(false),
  completedAt: z.string(),
});

const MyChallengeAttemptDtoSchema = z.object({
  attemptId: IdSchema,
  status: z.enum(['IN_PROGRESS', 'AI_COACHING', 'UNRESOLVED', 'COMPLETED']),
  isCorrect: z.boolean().nullable(),
  selectedAnswer: z.string().nullable(),
  usedAi: z.boolean().optional().default(false),
  maxUsedHintStep: z.number().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
});

const MyChallengeReviewDtoSchema = z.object({
  reviewId: IdSchema,
  content: z.string(),
  isActive: z.boolean().optional(),
  active: z.boolean().optional(),
  recommendCount: z.number().optional().default(0),
});

const MyChallengeDetailDtoSchema = z.object({
  challengeId: IdSchema,
  attempts: z.array(MyChallengeAttemptDtoSchema),
  reviews: z.array(MyChallengeReviewDtoSchema),
});

const AiCoachingSessionStatusSchema = z.enum([
  'READY',
  'COACHING',
  'WAITING_ANSWER',
  'GUIDE_TO_PROBLEM',
  'FINISHED',
  'ABANDONED',
]);

const AiCoachingMessageRoleSchema = z.enum(['STUDENT', 'ASSISTANT', 'SYSTEM']);

const AiCoachingEnumOptionSchema = z.object({
  code: z.string(),
  label: z.string(),
});

const AiCoachingPreferenceSchema = z
  .object({
    learningStage: AiCoachingEnumOptionSchema.nullable().optional(),
    learningGoal: AiCoachingEnumOptionSchema.nullable().optional(),
    difficultAreas: z.array(AiCoachingEnumOptionSchema).optional().default([]),
    customText: z.string().nullable().optional(),
    modDate: z.string().nullable().optional(),
  })
  .nullable();

const AiCoachingEnumResponseSchema = z.object({
  learningStage: z.array(AiCoachingEnumOptionSchema),
  learningGoal: z.array(AiCoachingEnumOptionSchema),
  difficultArea: z.array(AiCoachingEnumOptionSchema),
});

const AiCoachingSessionSchema = z.object({
  sessionId: IdSchema,
  status: AiCoachingSessionStatusSchema,
  startedAt: z.string().nullable().optional(),
});

const AiCoachingMessageSchema = z.object({
  role: AiCoachingMessageRoleSchema,
  content: z.string(),
  progressionStep: z.number().nullable().optional(),
  regDate: z.string().nullable().optional(),
});

const AiCoachingMessageResponseSchema = z.object({
  sessionId: IdSchema,
  studentMessageId: IdSchema,
  assistantMessageId: IdSchema,
  reply: z.string(),
  progressionStep: z.number().nullable().optional(),
  status: AiCoachingSessionStatusSchema,
  maxUsedHintStep: z.number().nullable().optional(),
});

const page = <Item extends z.ZodTypeAny>(item: Item) =>
  z.object({
    content: z.array(item),
    hasNext: z.boolean().optional().default(false),
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

const AdminChallengePayloadSchema = z.object({
  subject: AdminChallengeSubjectSchema,
  difficulty: AdminChallengeDifficultySchema,
  wrongAnswerRate: z.number().min(0).max(100).nullable(),
  title: z.string().min(1),
  sourceText: z.string().min(1),
  questionText: z.string().nullable(),
  questionMediaId: z.string().nullable(),
  choices: z.array(z.string().min(1)).min(1),
  correctAnswer: z.string().min(1),
  type: z.string().nullable(),
});

const AiCoachingPreferencePayloadSchema = z.object({
  learningStage: z.string().nullable().optional(),
  learningGoal: z.string().nullable().optional(),
  difficultAreas: z.array(z.string()).optional(),
  customText: z.string().max(500).nullable().optional(),
});

const CreateAiCoachingSessionPayloadSchema = z.object({
  challengeAttemptId: z.string().min(1),
});

const SendAiCoachingMessagePayloadSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

const ChallengeIdResponseSchema = z.object({
  challengeId: IdSchema,
});

export const dto = {
  listItem: ChallengeListItemDtoSchema,
  list: z.array(ChallengeListItemDtoSchema),
  listPage: page(ChallengeListItemDtoSchema),
  detail: ChallengeDetailDtoSchema,
  attempt: AttemptDtoSchema,
  answerResult: AnswerResultDtoSchema,
  review: ChallengeReviewDtoSchema,
  reviews: z.array(ChallengeReviewDtoSchema),
  reviewPage: page(ChallengeReviewDtoSchema),
  ranking: UserRankingDtoSchema,
  rankings: z.array(UserRankingDtoSchema),
  rankingPage: page(UserRankingDtoSchema),
  myChallengeListItem: MyChallengeListItemDtoSchema,
  myChallengeListPage: page(MyChallengeListItemDtoSchema),
  myChallengeDetail: MyChallengeDetailDtoSchema,
  challengeId: ChallengeIdResponseSchema,
  aiCoachingEnums: AiCoachingEnumResponseSchema,
  aiCoachingPreference: AiCoachingPreferenceSchema,
  aiCoachingSession: AiCoachingSessionSchema,
  aiCoachingMessage: AiCoachingMessageSchema,
  aiCoachingMessages: z.array(AiCoachingMessageSchema),
  aiCoachingMessageResponse: AiCoachingMessageResponseSchema,
};

export const payload = {
  startAttempt: StartAttemptPayloadSchema,
  submitAnswer: SubmitAnswerPayloadSchema,
  createReview: CreateReviewPayloadSchema,
  submitFeedback: SubmitFeedbackPayloadSchema,
  adminChallenge: AdminChallengePayloadSchema,
  aiCoachingPreference: AiCoachingPreferencePayloadSchema,
  createAiCoachingSession: CreateAiCoachingSessionPayloadSchema,
  sendAiCoachingMessage: SendAiCoachingMessagePayloadSchema,
};

export const params = {
  myChallengeResultFilter: MyChallengeResultFilterSchema,
};
