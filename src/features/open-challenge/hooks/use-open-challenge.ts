import { useRouter } from 'next/navigation';

import {
  type ChallengeListParams,
  type CreateChallengeReviewPayload,
  type StartChallengeAttemptPayload,
  type SubmitChallengeAnswerPayload,
  type SubmitChallengeFeedbackPayload,
  openChallengeKeys,
  repository,
} from '@/entities/open-challenge';
import { PUBLIC } from '@/shared/constants';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyOpenChallengeError } from '@/shared/lib/errors/errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ERROR_REDIRECT_DELAY_MS = 1500;

export const useOpenChallengeListQuery = (params: ChallengeListParams = {}) =>
  useQuery({
    queryKey: openChallengeKeys.list(params),
    queryFn: () => repository.getList(params),
  });

export const useOpenChallengeDetailQuery = (
  id: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.detail(id),
    queryFn: () => repository.getDetail(id),
    enabled: (options?.enabled ?? true) && id.length > 0,
  });

export const useChallengeReviewsQuery = (
  challengeId: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.reviews(challengeId),
    queryFn: () => repository.getReviews(challengeId),
    enabled: (options?.enabled ?? true) && challengeId.length > 0,
  });

export const useNextChallengeQuery = (
  challengeId: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.next(challengeId),
    queryFn: () => repository.getNextChallenge(challengeId),
    enabled: (options?.enabled ?? true) && challengeId.length > 0,
  });

export const useStartChallengeAttemptMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: StartChallengeAttemptPayload) =>
      repository.startAttempt(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {
        onContext: () =>
          setTimeout(
            () => router.replace(PUBLIC.OPEN_CHALLENGE.LIST),
            ERROR_REDIRECT_DELAY_MS
          ),
        onAuth: () =>
          setTimeout(
            () => router.replace(PUBLIC.CORE.LOGIN),
            ERROR_REDIRECT_DELAY_MS
          ),
      });
    },
  });
};

export const useSubmitChallengeAnswerMutation = (challengeId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      attemptId,
      params,
    }: {
      attemptId: string;
      params: SubmitChallengeAnswerPayload;
    }) => repository.submitAnswer(attemptId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
      queryClient.invalidateQueries({
        queryKey: openChallengeKeys.detail(challengeId),
      });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {
        onContext: () =>
          setTimeout(
            () => router.replace(PUBLIC.OPEN_CHALLENGE.LIST),
            ERROR_REDIRECT_DELAY_MS
          ),
        onAuth: () =>
          setTimeout(
            () => router.replace(PUBLIC.CORE.LOGIN),
            ERROR_REDIRECT_DELAY_MS
          ),
      });
    },
  });
};

export const useCreateChallengeReviewMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateChallengeReviewPayload) =>
      repository.createReview(params),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: openChallengeKeys.reviews(params.challengeId),
      });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {
        onAuth: () =>
          setTimeout(
            () => router.replace(PUBLIC.CORE.LOGIN),
            ERROR_REDIRECT_DELAY_MS
          ),
      });
    },
  });
};

export const useSubmitChallengeFeedbackMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: SubmitChallengeFeedbackPayload) =>
      repository.submitFeedback(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {
        onAuth: () =>
          setTimeout(
            () => router.replace(PUBLIC.CORE.LOGIN),
            ERROR_REDIRECT_DELAY_MS
          ),
      });
    },
  });
};
