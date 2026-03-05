import { api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';

import {
  LinkEmbedResponse,
  LinkPreviewData,
  UseLinkPreviewOptions,
} from '../types';

type FetchLinkPreviewResult = {
  available: boolean;
  data?: LinkPreviewData;
};

/**
 * 링크 임베드 미리보기 API 호출
 * POST /common/link-embeds/preview
 */
const fetchLinkPreview = async (
  url: string
): Promise<FetchLinkPreviewResult> => {
  const result = await api.private.post<LinkEmbedResponse>(
    '/common/link-embeds/preview',
    { url }
  );

  // available이 false면 데이터 없이 반환
  if (!result.data.available || !result.data.embed) {
    return {
      available: false,
    };
  }

  // available이 true면 embed 데이터를 LinkPreviewData 형식으로 변환
  const { embed } = result.data;
  return {
    available: true,
    data: {
      url: embed.url,
      title: embed.title,
      description: embed.description,
      image: embed.imageUrl,
      siteName: embed.siteName,
      embedType: embed.embedType,
      embedUrl: embed.embedUrl,
    },
  };
};

export const useLinkPreview = (options?: UseLinkPreviewOptions) => {
  const mutation = useMutation({
    mutationFn: fetchLinkPreview,
    onSuccess: (result) => {
      if (result.available && result.data) {
        options?.onSuccess?.(result.data);
      }
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return {
    fetchPreview: mutation.mutate,
    fetchPreviewAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
};
