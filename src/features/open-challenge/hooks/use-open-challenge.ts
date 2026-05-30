import { useRouter } from 'next/navigation';

import {
  type AiCoachingPreferencePayload,
  type ChallengeListParams,
  type CreateAiCoachingSessionPayload,
  type CreateChallengeReviewPayload,
  type SendAiCoachingMessagePayload,
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

export const useAiCoachingPreferenceEnumsQuery = (options?: {
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: openChallengeKeys.aiCoachingEnums(),
    queryFn: repository.getAiCoachingPreferenceEnums,
    enabled: options?.enabled,
  });

export const useMyAiCoachingPreferenceQuery = (options?: {
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: openChallengeKeys.aiCoachingPreference(),
    queryFn: repository.getMyAiCoachingPreference,
    enabled: options?.enabled,
  });

export const useAiCoachingMessagesQuery = (
  sessionId: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.aiCoachingMessages(sessionId),
    queryFn: () => repository.getAiCoachingMessages(sessionId),
    enabled: (options?.enabled ?? true) && sessionId.length > 0,
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

export const useUpdateMyAiCoachingPreferenceMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: AiCoachingPreferencePayload) =>
      repository.updateMyAiCoachingPreference(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: openChallengeKeys.aiCoachingPreference(),
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

export const useCreateAiCoachingSessionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateAiCoachingSessionPayload) =>
      repository.createAiCoachingSession(params),
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

export const useSendAiCoachingMessageMutation = (sessionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: SendAiCoachingMessagePayload) =>
      repository.sendAiCoachingMessage(sessionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: openChallengeKeys.aiCoachingMessages(sessionId),
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

export const useFinishAiCoachingSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      repository.finishAiCoachingSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {});
    },
  });
};

export const useAbandonAiCoachingSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      repository.abandonAiCoachingSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {});
    },
  });
};
