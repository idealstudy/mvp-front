import { domain } from '@/entities/open-challenge/core';
import {
  type AdminChallengeDetail,
  type AdminChallengeDifficulty,
  type AdminChallengePayload,
  type AiCoachingEnums,
  type AiCoachingMessage,
  type AiCoachingMessageResponse,
  type AiCoachingPreference,
  type AiCoachingPreferencePayload,
  type AiCoachingSession,
  type ChallengeAttempt,
  type ChallengeDetail,
  type ChallengeListItem,
  type ChallengeListParams,
  type ChallengeReview,
  type ChallengeReviewSort,
  type CreateAiCoachingSessionPayload,
  type CreateChallengeReviewPayload,
  type MyChallengeDetail,
  type MyChallengeListItem,
  type MyChallengeListParams,
  type NextChallenge,
  type SendAiCoachingMessagePayload,
  type StartChallengeAttemptPayload,
  type SubmitChallengeAnswerPayload,
  type SubmitChallengeFeedbackPayload,
  type UserRanking,
} from '@/entities/open-challenge/types';
import { api } from '@/shared/api';
import { unwrapEnvelope } from '@/shared/lib/api-utils';

import { dto, payload } from './open-challenge.dto';

/* ─────────────────────────────────────────────────────
 * 변환 상수 / Helper
 * ────────────────────────────────────────────────────*/
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

/* ─────────────────────────────────────────────────────
 * DTO → Domain 변환
 * ────────────────────────────────────────────────────*/
const toListItem = (raw: unknown): ChallengeListItem => {
  const parsed = dto.listItem.parse(raw);
  const id = parsed.id ?? parsed.challengeId;

  if (!id) {
    throw new Error('Challenge id is missing.');
  }

  return domain.listItem.parse({
    id,
    subject: toSubject(parsed.subject),
    difficulty: toAdminDifficulty(parsed.difficulty),
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
    isAiSupported: parsed.isAiSupported ?? parsed.aiSupported ?? true,
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
    passRate: parsed.passRate ?? null,
  };
};

const toReview = (raw: unknown): ChallengeReview => {
  const parsed = dto.review.parse(raw);
  return domain.review.parse({
    id:
      parsed.id ??
      parsed.reviewId ??
      `${parsed.nickname}-${parsed.recommendCount}`,
    nickname: parsed.nickname,
    subject: parsed.subject,
    content: parsed.content,
    recommendCount: parsed.recommendCount,
    isBest: parsed.isBest ?? parsed.best ?? false,
    isRecommendedByMe:
      parsed.isRecommendedByMe ?? parsed.recommendedByMe ?? false,
  });
};

const toMyChallengeListItem = (raw: unknown): MyChallengeListItem => {
  const parsed = dto.myChallengeListItem.parse(raw);

  return domain.myChallengeListItem.parse({
    challengeId: parsed.challengeId,
    subject: toSubject(parsed.subject),
    difficulty: parsed.difficulty,
    sourceText: parsed.sourceText,
    questionText: parsed.questionText ?? '문제 이미지를 보고 답을 선택했어요.',
    questionImageUrl: parsed.questionImageUrl,
    isCorrect: parsed.isCorrect,
    usedAi: parsed.usedAi,
    completedAt: parsed.completedAt,
  });
};

const toMyChallengeDetail = (raw: unknown): MyChallengeDetail => {
  const parsed = dto.myChallengeDetail.parse(raw);

  return domain.myChallengeDetail.parse({
    challengeId: parsed.challengeId,
    attempts: parsed.attempts.map((attempt) => ({
      ...attempt,
      maxUsedHintStep: attempt.maxUsedHintStep ?? null,
      startedAt: attempt.startedAt ?? null,
      completedAt: attempt.completedAt ?? null,
    })),
    reviews: parsed.reviews.map((review) => ({
      reviewId: review.reviewId,
      content: review.content,
      isActive: review.isActive ?? review.active ?? false,
      recommendCount: review.recommendCount,
    })),
  });
};

/* ─────────────────────────────────────────────────────
 * [READ] 오픈챌린지 목록 조회 (공개)
 * ────────────────────────────────────────────────────*/
const getChallengeList = async (
  params: ChallengeListParams = {}
): Promise<ChallengeListItem[]> => {
  const response = await api.public.get('/public/challenges', {
    params: toApiParams(params),
  });
  const page = unwrapEnvelope(response, dto.listPage);
  return page.content.map(toListItem);
};

/* ─────────────────────────────────────────────────────
 * [READ] 관리자페이지 - 오픈챌린지 목록 조회
 * ────────────────────────────────────────────────────*/
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

/* ─────────────────────────────────────────────────────
 * [READ] 오픈챌린지 상세 조회 (공개)
 * ────────────────────────────────────────────────────*/
const getChallengeDetail = async (id: string): Promise<ChallengeDetail> => {
  const response = await api.public.get(`/public/challenges/${id}`);
  const detail = unwrapEnvelope(response, dto.detail);
  return toDetail(detail);
};

/* ─────────────────────────────────────────────────────
 * [READ] 관리자페이지 - 오픈챌린지 상세 조회
 * ────────────────────────────────────────────────────*/
const getAdminChallengeDetail = async (
  id: string
): Promise<AdminChallengeDetail> => {
  const response = await api.public.get(`/public/challenges/${id}`);
  const detail = unwrapEnvelope(response, dto.detail);
  return toAdminDetail(detail);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 관리자페이지 - 오픈챌린지 생성
 * ────────────────────────────────────────────────────*/
const createAdminChallenge = async (
  params: AdminChallengePayload
): Promise<string> => {
  const validated = payload.adminChallenge.parse(params);
  const response = await api.private.post('/admin/challenges', validated);
  const result = unwrapEnvelope(response, dto.challengeId);
  return result.challengeId;
};

/* ─────────────────────────────────────────────────────
 * [UPDATE] 관리자페이지 - 오픈챌린지 수정
 * ────────────────────────────────────────────────────*/
const updateAdminChallenge = async (
  id: string,
  params: AdminChallengePayload
): Promise<void> => {
  const validated = payload.adminChallenge.parse(params);
  await api.private.put(`/admin/challenges/${id}`, validated);
};

/* ─────────────────────────────────────────────────────
 * [PATCH] 관리자페이지 - 오픈챌린지 숨김 처리
 * ────────────────────────────────────────────────────*/
const hideAdminChallenge = async (id: string): Promise<void> => {
  await api.private.patch(`/admin/challenges/${id}/hide`);
};

/* ─────────────────────────────────────────────────────
 * [PATCH] 관리자페이지 - 오픈챌린지 노출 처리
 * ────────────────────────────────────────────────────*/
const showAdminChallenge = async (id: string): Promise<void> => {
  await api.private.patch(`/admin/challenges/${id}/show`);
};

/* ─────────────────────────────────────────────────────
 * [DELETE] 관리자페이지 - 오픈챌린지 삭제
 * ────────────────────────────────────────────────────*/
const deleteAdminChallenge = async (id: string): Promise<void> => {
  await api.private.delete(`/admin/challenges/${id}`);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 오픈챌린지 풀이 시작
 * ────────────────────────────────────────────────────*/
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

/* ─────────────────────────────────────────────────────
 * [PATCH] 오픈챌린지 정답 제출
 * ────────────────────────────────────────────────────*/
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

/* ─────────────────────────────────────────────────────
 * [READ] 오픈챌린지 리뷰 목록 조회
 * ────────────────────────────────────────────────────*/
const getChallengeReviews = async (
  challengeId: string,
  sort: ChallengeReviewSort = 'recommend'
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

/* ─────────────────────────────────────────────────────
 * [CREATE] 오픈챌린지 리뷰 작성
 * ────────────────────────────────────────────────────*/
const createChallengeReview = async (
  params: CreateChallengeReviewPayload
): Promise<void> => {
  const validated = payload.createReview.parse(params);
  await api.private.post('/common/challenge-reviews', validated);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 오픈챌린지 리뷰 추천
 * ────────────────────────────────────────────────────*/
const recommendChallengeReview = async (reviewId: string): Promise<void> => {
  await api.private.post(`/common/challenge-reviews/${reviewId}/recommends`);
};

/* ─────────────────────────────────────────────────────
 * [DELETE] 오픈챌린지 리뷰 추천 취소
 * ────────────────────────────────────────────────────*/
const cancelChallengeReviewRecommend = async (
  reviewId: string
): Promise<void> => {
  await api.private.delete(`/common/challenge-reviews/${reviewId}/recommends`);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] 오픈챌린지 피드백 제출
 * ────────────────────────────────────────────────────*/
const submitChallengeFeedback = async (
  params: SubmitChallengeFeedbackPayload
): Promise<void> => {
  const validated = payload.submitFeedback.parse(params);
  await api.private.post('/common/challenge-feedbacks', validated);
};

/* ─────────────────────────────────────────────────────
 * [READ] AI 코칭 선호도 선택지 조회
 * ────────────────────────────────────────────────────*/
const getAiCoachingPreferenceEnums = async (): Promise<AiCoachingEnums> => {
  const response = await api.private.get(
    '/common/ai-coaching-preferences/enums'
  );
  return unwrapEnvelope(response, dto.aiCoachingEnums);
};

/* ─────────────────────────────────────────────────────
 * [READ] 내 AI 코칭 선호도 조회
 * ────────────────────────────────────────────────────*/
const getMyAiCoachingPreference = async (): Promise<AiCoachingPreference> => {
  const response = await api.private.get('/common/ai-coaching-preferences/me');
  return unwrapEnvelope(response, dto.aiCoachingPreference);
};

/* ─────────────────────────────────────────────────────
 * [UPDATE] 내 AI 코칭 선호도 수정
 * ────────────────────────────────────────────────────*/
const updateMyAiCoachingPreference = async (
  params: AiCoachingPreferencePayload
): Promise<AiCoachingPreference> => {
  const validated = payload.aiCoachingPreference.parse(params);
  const response = await api.private.put(
    '/common/ai-coaching-preferences/me',
    validated
  );
  return unwrapEnvelope(response, dto.aiCoachingPreference);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] AI 코칭 세션 생성
 * ────────────────────────────────────────────────────*/
const createAiCoachingSession = async (
  params: CreateAiCoachingSessionPayload
): Promise<AiCoachingSession> => {
  const validated = payload.createAiCoachingSession.parse(params);
  const response = await api.private.post(
    '/common/ai-coaching-sessions',
    validated
  );
  return unwrapEnvelope(response, dto.aiCoachingSession);
};

/* ─────────────────────────────────────────────────────
 * [CREATE] AI 코칭 메시지 전송
 * ────────────────────────────────────────────────────*/
const sendAiCoachingMessage = async (
  sessionId: string,
  params: SendAiCoachingMessagePayload
): Promise<AiCoachingMessageResponse> => {
  const validated = payload.sendAiCoachingMessage.parse(params);
  const response = await api.private.post(
    `/common/ai-coaching-sessions/${sessionId}/messages`,
    validated
  );
  return unwrapEnvelope(response, dto.aiCoachingMessageResponse);
};

/* ─────────────────────────────────────────────────────
 * [READ] AI 코칭 메시지 목록 조회
 * ────────────────────────────────────────────────────*/
const getAiCoachingMessages = async (
  sessionId: string
): Promise<AiCoachingMessage[]> => {
  const response = await api.private.get(
    `/common/ai-coaching-sessions/${sessionId}/messages`
  );
  return unwrapEnvelope(response, dto.aiCoachingMessages);
};

/* ─────────────────────────────────────────────────────
 * [PATCH] AI 코칭 세션 종료
 * ────────────────────────────────────────────────────*/
const finishAiCoachingSession = async (sessionId: string): Promise<void> => {
  await api.private.patch(`/common/ai-coaching-sessions/${sessionId}/finish`);
};

/* ─────────────────────────────────────────────────────
 * [PATCH] AI 코칭 세션 포기
 * ────────────────────────────────────────────────────*/
const abandonAiCoachingSession = async (sessionId: string): Promise<void> => {
  await api.private.patch(`/common/ai-coaching-sessions/${sessionId}/abandon`);
};

/* ─────────────────────────────────────────────────────
 * [READ] 오픈챌린지 랭킹 조회 (공개)
 * ────────────────────────────────────────────────────*/
const getChallengeRanking = async (): Promise<UserRanking[]> => {
  const response = await api.public.get('/public/challenge-rankings');
  const page = unwrapEnvelope(response, dto.rankingPage);
  return page.content.map((ranking) => domain.ranking.parse(ranking));
};

/* ─────────────────────────────────────────────────────
 * [READ] 마이페이지 - 내 오픈챌린지 목록 조회
 * ────────────────────────────────────────────────────*/
const getMyChallengeList = async (params: MyChallengeListParams = {}) => {
  const response = await api.private.get('/common/me/challenges', {
    params: {
      result: params.result ?? 'ALL',
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });
  const page = unwrapEnvelope(response, dto.myChallengeListPage);

  return {
    ...page,
    content: page.content.map(toMyChallengeListItem),
  };
};

/* ─────────────────────────────────────────────────────
 * [READ] 마이페이지 - 내 오픈챌린지 상세 조회
 * ────────────────────────────────────────────────────*/
const getMyChallengeDetail = async (
  challengeId: string
): Promise<MyChallengeDetail> => {
  const response = await api.private.get(
    `/common/me/challenges/${challengeId}`
  );
  return toMyChallengeDetail(unwrapEnvelope(response, dto.myChallengeDetail));
};

/* ─────────────────────────────────────────────────────
 * [READ] 다음 오픈챌린지 조회
 * ────────────────────────────────────────────────────*/
const getNextChallenge = async (
  currentChallengeId: string
): Promise<NextChallenge | null> => {
  const list = await getChallengeList({ subject: 'MATH', sort: 'popular' });
  return list.find((challenge) => challenge.id !== currentChallengeId) ?? null;
};

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
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
  recommendReview: recommendChallengeReview,
  cancelReviewRecommend: cancelChallengeReviewRecommend,
  submitFeedback: submitChallengeFeedback,
  getRanking: getChallengeRanking,
  getMyList: getMyChallengeList,
  getMyDetail: getMyChallengeDetail,
  getNextChallenge,
  getAiCoachingPreferenceEnums,
  getMyAiCoachingPreference,
  updateMyAiCoachingPreference,
  createAiCoachingSession,
  sendAiCoachingMessage,
  getAiCoachingMessages,
  finishAiCoachingSession,
  abandonAiCoachingSession,
};
