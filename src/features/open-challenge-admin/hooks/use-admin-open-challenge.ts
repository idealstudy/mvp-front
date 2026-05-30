import {
  type AdminChallengePayload,
  type ChallengeListParams,
  openChallengeKeys,
  repository,
} from '@/entities/open-challenge';
import { handleApiError } from '@/shared/lib/errors/error-handler';
import { classifyOpenChallengeError } from '@/shared/lib/errors/errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LIST_PAGE_SIZE = 10;

export const useAdminOpenChallengeListQuery = (
  params: ChallengeListParams = {}
) =>
  useQuery({
    queryKey: openChallengeKeys.adminList({
      ...params,
      size: params.size ?? LIST_PAGE_SIZE,
    }),
    queryFn: () =>
      repository.getAdminList({
        ...params,
        size: params.size ?? LIST_PAGE_SIZE,
      }),
  });

export const useAdminOpenChallengeDetailQuery = (
  id: string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: openChallengeKeys.adminDetail(id),
    queryFn: () => repository.getAdminDetail(id),
    enabled: (options?.enabled ?? true) && id.length > 0,
  });

export const useCreateAdminOpenChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AdminChallengePayload) =>
      repository.createAdmin(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
  });
};

export const useUpdateAdminOpenChallengeMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AdminChallengePayload) =>
      repository.updateAdmin(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: openChallengeKeys.adminDetail(id),
      });
    },
  });
};

export const useHideAdminOpenChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.hideAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {});
    },
  });
};

export const useShowAdminOpenChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.showAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {});
    },
  });
};

export const useDeleteAdminOpenChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: openChallengeKeys.all });
    },
    onError: (error) => {
      handleApiError(error, classifyOpenChallengeError, {});
    },
  });
};
