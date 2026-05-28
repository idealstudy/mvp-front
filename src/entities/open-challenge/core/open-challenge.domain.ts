import { z } from 'zod';

const ChallengeSubjectSchema = z.enum(['MATH', 'KOREAN', 'ENGLISH', 'SCIENCE']);

const ChallengeListItemSchema = z.object({
  id: z.string(),
  subject: ChallengeSubjectSchema,
  title: z.string(),
  sourceText: z.string(),
  questionImageUrl: z.string().nullable(),
  passRate: z.number(),
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
  passRate: z.number(),
  wrongAnswerRate: z.number(),
  participantCount: z.number(),
  isAiSupported: z.boolean(),
});

const ChallengeAnswerResultSchema = z.object({
  isCorrect: z.boolean(),
  correctAnswer: z.string(),
  participantCount: z.number(),
  passRate: z.number(),
});

const ChallengeReviewSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  subject: z.string(),
  content: z.string(),
  recommendCount: z.number(),
  isBest: z.boolean(),
});

const NextChallengeSchema = ChallengeListItemSchema;

const UserRankingSchema = z.object({
  userId: z.string().optional(),
  nickname: z.string(),
  streakDays: z.number(),
  challengeCount: z.number(),
  correctRate: z.number(),
});

export const domain = {
  subject: ChallengeSubjectSchema,
  listItem: ChallengeListItemSchema,
  detail: ChallengeDetailSchema,
  answerResult: ChallengeAnswerResultSchema,
  review: ChallengeReviewSchema,
  nextChallenge: NextChallengeSchema,
  ranking: UserRankingSchema,
};
