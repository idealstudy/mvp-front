import { domain } from '@/entities/open-challenge/core';
import {
  type AdminChallengeDetail,
  type AdminChallengeDifficulty,
  type AdminChallengePayload,
  type ChallengeAttempt,
  type ChallengeDetail,
  type ChallengeListItem,
  type ChallengeListParams,
  type ChallengeReview,
  type CreateChallengeReviewPayload,
  type NextChallenge,
  type StartChallengeAttemptPayload,
  type SubmitChallengeAnswerPayload,
  type SubmitChallengeFeedbackPayload,
  type UserRanking,
} from '@/entities/open-challenge/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './open-challenge.dto';

const SUBJECT_LABELS = {
  MATH: '수학',
  KOREAN: '국어',
  ENGLISH: '영어',
  SCIENCE: '탐구',
} as const;

const toSubject = (subject: string): keyof typeof SUBJECT_LABELS => {
  switch (subject.toLowerCase()) {
    case 'korean':
      return 'KOREAN';
    case 'english':
      return 'ENGLISH';
    case 'science':
      return 'SCIENCE';
    case 'math':
    default:
      return 'MATH';
  }
};

const toAdminDifficulty = (difficulty: string): AdminChallengeDifficulty => {
  switch (difficulty.toUpperCase()) {
    case 'TOP':
    case 'HIGHEST':
    case '최상':
      return 'TOP';
    case 'HIGH':
    case '상':
      return 'HIGH';
    case 'LOW':
    case '하':
      return 'LOW';
    case 'MID':
    case 'MIDDLE':
    case '중':
    default:
      return 'MID';
  }
};

const toApiParams = (params: ChallengeListParams) => ({
  subject:
    !params.subject || params.subject === 'ALL' ? undefined : params.subject,
  difficulty:
    !params.difficulty || params.difficulty === 'ALL'
      ? undefined
      : {
          highest: 'TOP',
          high: 'HIGH',
          middle: 'MID',
          low: 'LOW',
        }[params.difficulty],
  sort:
    params.sort === 'latest'
      ? 'LATEST'
      : params.sort === 'popular'
        ? 'POPULAR'
        : undefined,
  page: params.page,
  size: params.size,
});

const toListItem = (raw: unknown): ChallengeListItem => {
  const parsed = dto.listItem.parse(raw);
  const id = parsed.id ?? parsed.challengeId;

  if (!id) {
    throw new Error('Challenge id is missing.');
  }

  return domain.listItem.parse({
    id,
    subject: toSubject(parsed.subject),
    title: parsed.questionText ?? parsed.title,
    sourceText: parsed.sourceText,
    questionImageUrl: parsed.questionImageUrl,
    passRate: parsed.passRate,
    participantCount: parsed.participantCount,
  });
};

const toDetail = (raw: unknown): ChallengeDetail => {
  const parsed = dto.detail.parse(raw);
  const subject = toSubject(parsed.subject);
  const id = parsed.id ?? parsed.challengeId;

  if (!id) {
    throw new Error('Challenge id is missing.');
  }

  return domain.detail.parse({
    id,
    subject: SUBJECT_LABELS[subject],
    topic: parsed.topic ?? parsed.sourceText ?? parsed.title,
    questionNumber: parsed.questionNumber,
    questionText: parsed.questionText,
    questionImageUrl: parsed.questionImageUrl,
    choices: parsed.choices,
    passRate: parsed.passRate,
    wrongAnswerRate: parsed.wrongAnswerRate,
    participantCount: parsed.participantCount,
    isAiSupported: parsed.isAiSupported,
  });
};

const toAdminDetail = (raw: unknown): AdminChallengeDetail => {
  const parsed = dto.detail.parse(raw);
  const id = parsed.id ?? parsed.challengeId;

  if (!id) {
    throw new Error('Challenge id is missing.');
  }

  return {
    id,
    subject: toSubject(parsed.subject),
    difficulty: toAdminDifficulty(parsed.difficulty),
    wrongAnswerRate: parsed.wrongAnswerRate,
    title: parsed.title,
    sourceText: parsed.sourceText,
    questionText: parsed.questionText,
    questionImageUrl: parsed.questionImageUrl,
    choices: parsed.choices,
    correctAnswer: parsed.correctAnswer ?? '',
    type: parsed.type ?? '',
    participantCount: parsed.participantCount,
    passRate: parsed.passRate,
  };
};

const toReview = (raw: unknown): ChallengeReview => {
  const parsed = dto.review.parse(raw);
  return domain.review.parse({
    id: parsed.id ?? `${parsed.nickname}-${parsed.recommendCount}`,
    nickname: parsed.nickname,
    subject: parsed.subject,
    content: parsed.content,
    recommendCount: parsed.recommendCount,
    isBest: parsed.isBest,
  });
};

const getChallengeList = async (
  params: ChallengeListParams = {}
): Promise<ChallengeListItem[]> => {
  const response = await api.public.get('/public/challenges', {
    params: toApiParams(params),
  });
  const page = unwrapEnvelope(response, dto.listPage);
  return page.content.map(toListItem);
};

const getAdminChallengeList = async (params: ChallengeListParams = {}) => {
  const response = await api.public.get('/public/challenges', {
    params: toApiParams(params),
  });
  const page = unwrapEnvelope(response, dto.listPage);

  return {
    ...page,
    content: page.content.map(toListItem),
  };
};

const getChallengeDetail = async (id: string): Promise<ChallengeDetail> => {
  const response = await api.public.get(`/public/challenges/${id}`);
  const detail = unwrapEnvelope(response, dto.detail);
  return toDetail(detail);
};

const getAdminChallengeDetail = async (
  id: string
): Promise<AdminChallengeDetail> => {
  const response = await api.public.get(`/public/challenges/${id}`);
  const detail = unwrapEnvelope(response, dto.detail);
  return toAdminDetail(detail);
};

const createAdminChallenge = async (
  params: AdminChallengePayload
): Promise<string> => {
  const validated = payload.adminChallenge.parse(params);
  const response = await api.private.post('/admin/challenges', validated);
  const result = unwrapEnvelope(response, dto.challengeId);
  return result.challengeId;
};

const updateAdminChallenge = async (
  id: string,
  params: AdminChallengePayload
): Promise<void> => {
  const validated = payload.adminChallenge.parse(params);
  await api.private.put(`/admin/challenges/${id}`, validated);
};

const hideAdminChallenge = async (id: string): Promise<void> => {
  await api.private.patch(`/admin/challenges/${id}/hide`);
};

const showAdminChallenge = async (id: string): Promise<void> => {
  await api.private.patch(`/admin/challenges/${id}/show`);
};

const deleteAdminChallenge = async (id: string): Promise<void> => {
  await api.private.delete(`/admin/challenges/${id}`);
};

const startChallengeAttempt = async (
  params: StartChallengeAttemptPayload
): Promise<ChallengeAttempt> => {
  const validated = payload.startAttempt.parse(params);
  const response = await api.private.post(
    '/common/challenge-attempts',
    validated
  );
  return unwrapEnvelope(response, dto.attempt);
};

const submitChallengeAnswer = async (
  attemptId: string,
  params: SubmitChallengeAnswerPayload
) => {
  const validated = payload.submitAnswer.parse(params);
  const response = await api.private.patch(
    `/common/challenge-attempts/${attemptId}/answer`,
    validated
  );
  return domain.answerResult.parse(unwrapEnvelope(response, dto.answerResult));
};

const getChallengeReviews = async (
  challengeId: string,
  sort = 'recommend'
): Promise<ChallengeReview[]> => {
  const response = await api.private.get(
    `/common/challenges/${challengeId}/reviews`,
    {
      params: { sort: sort === 'latest' ? 'LATEST' : 'RECOMMEND' },
    }
  );
  const page = unwrapEnvelope(response, dto.reviewPage);
  return page.content.map(toReview);
};

const createChallengeReview = async (
  params: CreateChallengeReviewPayload
): Promise<void> => {
  const validated = payload.createReview.parse(params);
  await api.private.post('/common/challenge-reviews', validated);
};

const submitChallengeFeedback = async (
  params: SubmitChallengeFeedbackPayload
): Promise<void> => {
  const validated = payload.submitFeedback.parse(params);
  await api.private.post('/common/challenge-feedbacks', validated);
};

const getChallengeRanking = async (): Promise<UserRanking[]> => {
  const response = await api.public.get('/public/challenge-rankings');
  const page = unwrapEnvelope(response, dto.rankingPage);
  return page.content.map((ranking) => domain.ranking.parse(ranking));
};

const getNextChallenge = async (
  currentChallengeId: string
): Promise<NextChallenge | null> => {
  const list = await getChallengeList({ subject: 'MATH', sort: 'popular' });
  return list.find((challenge) => challenge.id !== currentChallengeId) ?? null;
};

export const repository = {
  getList: getChallengeList,
  getAdminList: getAdminChallengeList,
  getDetail: getChallengeDetail,
  getAdminDetail: getAdminChallengeDetail,
  createAdmin: createAdminChallenge,
  updateAdmin: updateAdminChallenge,
  hideAdmin: hideAdminChallenge,
  showAdmin: showAdminChallenge,
  deleteAdmin: deleteAdminChallenge,
  startAttempt: startChallengeAttempt,
  submitAnswer: submitChallengeAnswer,
  getReviews: getChallengeReviews,
  createReview: createChallengeReview,
  submitFeedback: submitChallengeFeedback,
  getRanking: getChallengeRanking,
  getNextChallenge,
};
