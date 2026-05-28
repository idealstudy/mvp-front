import { domain } from '@/entities/open-challenge/core';
import { payload } from '@/entities/open-challenge/infrastructure/open-challenge.dto';
import { z } from 'zod';

export type ChallengeSubject = z.infer<typeof domain.subject>;
export type ChallengeListItem = z.infer<typeof domain.listItem>;
export type ChallengeDetail = z.infer<typeof domain.detail>;
export type ChallengeAnswerResult = z.infer<typeof domain.answerResult>;
export type ChallengeReview = z.infer<typeof domain.review>;
export type NextChallenge = z.infer<typeof domain.nextChallenge>;
export type UserRanking = z.infer<typeof domain.ranking>;

export type ChallengeListParams = {
  subject?: ChallengeSubject | 'ALL';
  difficulty?: 'highest' | 'high' | 'middle' | 'low' | 'ALL';
  sort?: 'latest' | 'popular';
};

export type ChallengeAttempt = {
  attemptId: string;
  status: string;
};

export type StartChallengeAttemptPayload = z.infer<typeof payload.startAttempt>;
export type SubmitChallengeAnswerPayload = z.infer<typeof payload.submitAnswer>;
export type CreateChallengeReviewPayload = z.infer<typeof payload.createReview>;
export type SubmitChallengeFeedbackPayload = z.infer<
  typeof payload.submitFeedback
>;
