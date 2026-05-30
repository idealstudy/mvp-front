import { type ChallengeListParams } from '../types';

const normalizeListParams = (params: ChallengeListParams = {}) => ({
  subject: params.subject ?? 'ALL',
  difficulty: params.difficulty ?? 'ALL',
  sort: params.sort ?? 'latest',
  page: params.page ?? 0,
  size: params.size ?? 20,
});

export const openChallengeKeys = {
  all: ['open-challenge'] as const,
  list: (params: ChallengeListParams = {}) =>
    [...openChallengeKeys.all, 'list', normalizeListParams(params)] as const,
  detail: (id: string) => [...openChallengeKeys.all, 'detail', id] as const,
  next: (id: string) => [...openChallengeKeys.all, 'next', id] as const,
  reviews: (challengeId: string, sort = 'recommend') =>
    [...openChallengeKeys.all, 'reviews', challengeId, sort] as const,
  ranking: () => [...openChallengeKeys.all, 'ranking'] as const,
  adminList: (params: ChallengeListParams = {}) =>
    [
      ...openChallengeKeys.all,
      'admin-list',
      normalizeListParams(params),
    ] as const,
  adminDetail: (id: string) =>
    [...openChallengeKeys.all, 'admin-detail', id] as const,
};
