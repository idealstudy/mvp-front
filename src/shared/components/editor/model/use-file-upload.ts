import { api } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';

import {
  MediaUploadResult,
  PresignBatchResponse,
  UseFileUploadOptions,
} from '../types';

type UploadFileParams = {
  file: File;
};

type UploadFileBatchParams = {
  files: File[];
};

const uploadFileApi = async ({
  file,
}: UploadFileParams): Promise<MediaUploadResult> => {
  const presignData = await api.private.post<PresignBatchResponse>(
    '/common/media/presign-batch',
    {
      mediaAssetList: [
        {
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
        },
      ],
    }
  );

  const mediaAsset = presignData.data.mediaAssetList[0];

  if (!mediaAsset) {
    throw new Error('파일 업로드 정보를 가져오는데 실패했습니다.');
  }

  const uploadResponse = await fetch(mediaAsset.uploadUrl, {
    method: 'PUT',
    headers: mediaAsset.headers,
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  return {
    mediaId: mediaAsset.mediaId,
    mediaUrl: `media://${mediaAsset.mediaId}`,
    fileName: file.name,
    sizeBytes: file.size,
  };
};

// 배치 업로드 API
const uploadFileBatchApi = async ({
  files,
}: UploadFileBatchParams): Promise<MediaUploadResult[]> => {
  if (files.length === 0) {
    return [];
  }

  // 모든 파일에 대한 Presign URL 요청
  const presignData = await api.private.post<PresignBatchResponse>(
    '/common/media/presign-batch',
    {
      mediaAssetList: files.map((file) => ({
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
      })),
    }
  );

  // 모든 파일을 병렬로 업로드
  const uploadPromises = presignData.data.mediaAssetList.map(
    async (mediaAsset, index) => {
      const file = files[index];
      if (!file || !mediaAsset) {
        throw new Error('파일 업로드 정보를 가져오는데 실패했습니다.');
      }

      const uploadResponse = await fetch(mediaAsset.uploadUrl, {
        method: 'PUT',
        headers: mediaAsset.headers,
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`${file.name} 업로드에 실패했습니다.`);
      }

      return {
        mediaId: mediaAsset.mediaId,
        mediaUrl: `media://${mediaAsset.mediaId}`,
        fileName: file.name,
        sizeBytes: file.size,
      };
    }
  );

  return Promise.all(uploadPromises);
};

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadFileApi({ file }),
    onSuccess: (result) => {
      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  const batchMutation = useMutation({
    mutationFn: (files: File[]) => uploadFileBatchApi({ files }),
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    uploadBatch: batchMutation.mutate,
    uploadBatchAsync: batchMutation.mutateAsync,
    isUploading: mutation.isPending || batchMutation.isPending,
    error: mutation.error || batchMutation.error,
    reset: () => {
      mutation.reset();
      batchMutation.reset();
    },
  };
};
