import { useCallback } from 'react';

import { UPLOAD_ERROR_MESSAGES } from '@/shared/components/editor/constants';
import { useFileUpload } from '@/shared/components/editor/model/use-file-upload';
import { useImageUpload } from '@/shared/components/editor/model/use-image-upload';
import { MediaTargetType } from '@/shared/components/editor/types';
import {
  getUploadErrorMessage,
  validateAttachmentFile,
  validateImageFile,
} from '@/shared/components/editor/utils';
import { Editor } from '@tiptap/react';

export type UseEditorUploadsOptions = {
  targetType?: MediaTargetType;
  onImageUpload?: (file: File) => Promise<string>;
  onFileUpload?: (
    file: File
  ) => Promise<{ url: string; name: string; size: number }>;
  onError?: (message: string) => void;
};

export type UseEditorUploadsReturn = {
  handleImageUpload: (file: File, editor: Editor | null) => Promise<void>;
  handleImageBatchUpload: (
    files: File[],
    editor: Editor | null
  ) => Promise<void>;
  handleFileUpload: (file: File, editor: Editor | null) => Promise<void>;
  handleFileBatchUpload: (
    files: File[],
    editor: Editor | null
  ) => Promise<void>;
};

export const useEditorUploads = ({
  targetType,
  onImageUpload: customImageUpload,
  onFileUpload: customFileUpload,
  onError,
}: UseEditorUploadsOptions): UseEditorUploadsReturn => {
  const {
    uploadAsync: uploadImageAsync,
    uploadBatchAsync: uploadImageBatchAsync,
  } = useImageUpload({
    targetType,
    onError: (error) => {
      onError?.(error.message || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
    },
  });

  const {
    uploadAsync: uploadFileAsync,
    uploadBatchAsync: uploadFileBatchAsync,
  } = useFileUpload({
    targetType,
    onError: (error) => {
      onError?.(error.message || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
    },
  });

  const handleImageUpload = useCallback(
    async (file: File, editor: Editor | null) => {
      if (!editor) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError?.(validation.error || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      const uploadId = `upload-${Date.now()}-${Math.random()}`;

      editor
        .chain()
        .focus()
        .setImage({
          src: blobUrl,
          isUploading: true,
          mediaId: uploadId,
        })
        .run();

      try {
        if (customImageUpload) {
          const url = await customImageUpload(file);
          updateImageNode(editor, uploadId, { src: url, isUploading: false });
          URL.revokeObjectURL(blobUrl);
        } else {
          const result = await uploadImageAsync(file);
          updateImageNode(editor, uploadId, {
            mediaId: result.mediaId,
            isUploading: false,
          });
        }
      } catch (error) {
        removeNodeByUploadId(editor, uploadId);
        URL.revokeObjectURL(blobUrl);

        const errorMessage =
          error instanceof Error
            ? getUploadErrorMessage(error)
            : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
        onError?.(errorMessage);
      }
    },
    [customImageUpload, uploadImageAsync, onError]
  );

  const handleImageBatchUpload = useCallback(
    async (files: File[], editor: Editor | null) => {
      if (!editor || files.length === 0) return;

      const uploadInfos = files
        .map((file) => {
          const validation = validateImageFile(file);
          if (!validation.valid) {
            onError?.(validation.error || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
            return null;
          }

          const blobUrl = URL.createObjectURL(file);
          const uploadId = `upload-${Date.now()}-${Math.random()}`;
          return { file, blobUrl, uploadId };
        })
        .filter((info): info is NonNullable<typeof info> => info !== null);

      if (uploadInfos.length === 0) return;

      const imageNodes = uploadInfos.map(({ blobUrl, uploadId }) => ({
        type: 'image' as const,
        attrs: {
          src: blobUrl,
          isUploading: true,
          mediaId: uploadId,
        },
      }));

      editor.chain().focus().insertContent(imageNodes).run();

      try {
        if (customImageUpload) {
          for (const { file, blobUrl, uploadId } of uploadInfos) {
            try {
              const url = await customImageUpload(file);
              updateImageNode(editor, uploadId, {
                src: url,
                isUploading: false,
              });
              URL.revokeObjectURL(blobUrl);
            } catch (error) {
              removeNodeByUploadId(editor, uploadId);
              URL.revokeObjectURL(blobUrl);

              const errorMessage =
                error instanceof Error
                  ? getUploadErrorMessage(error)
                  : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
              onError?.(errorMessage);
            }
          }
        } else {
          const results = await uploadImageBatchAsync(
            uploadInfos.map((info) => info.file)
          );

          results.forEach((result, index) => {
            const uploadInfo = uploadInfos[index];
            if (!uploadInfo) return;
            updateImageNode(editor, uploadInfo.uploadId, {
              mediaId: result.mediaId,
              isUploading: false,
            });
          });
        }
      } catch (error) {
        for (const { blobUrl, uploadId } of uploadInfos) {
          removeNodeByUploadId(editor, uploadId);
          URL.revokeObjectURL(blobUrl);
        }

        const errorMessage =
          error instanceof Error
            ? getUploadErrorMessage(error)
            : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
        onError?.(errorMessage);
      }
    },
    [customImageUpload, uploadImageBatchAsync, onError]
  );

  const handleFileUpload = useCallback(
    async (file: File, editor: Editor | null) => {
      if (!editor) return;

      const validation = validateAttachmentFile(file);
      if (!validation.valid) {
        onError?.(validation.error || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
        return;
      }

      const uploadId = `upload-${Date.now()}-${Math.random()}`;
      const blobUrl = URL.createObjectURL(file);

      editor
        .chain()
        .focus()
        .insertContent({
          type: 'fileAttachment',
          attrs: {
            url: blobUrl,
            name: file.name,
            size: file.size,
            mediaId: uploadId,
            isUploading: true,
          },
        })
        .run();

      try {
        if (customFileUpload) {
          const { url, name, size } = await customFileUpload(file);
          updateFileNode(editor, uploadId, {
            url,
            name,
            size,
            isUploading: false,
          });
          URL.revokeObjectURL(blobUrl);
        } else {
          const result = await uploadFileAsync(file);
          updateFileNode(editor, uploadId, {
            name: result.fileName,
            size: result.sizeBytes,
            mediaId: result.mediaId,
            isUploading: false,
          });
        }
      } catch (error) {
        removeNodeByUploadId(editor, uploadId);
        URL.revokeObjectURL(blobUrl);

        const errorMessage =
          error instanceof Error
            ? getUploadErrorMessage(error)
            : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
        onError?.(errorMessage);
      }
    },
    [customFileUpload, uploadFileAsync, onError]
  );

  const handleFileBatchUpload = useCallback(
    async (files: File[], editor: Editor | null) => {
      if (!editor || files.length === 0) return;

      const uploadInfos = files
        .map((file) => {
          const validation = validateAttachmentFile(file);
          if (!validation.valid) {
            onError?.(validation.error || UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED);
            return null;
          }

          const uploadId = `upload-${Date.now()}-${Math.random()}`;
          const blobUrl = URL.createObjectURL(file);
          return { file, blobUrl, uploadId };
        })
        .filter((info): info is NonNullable<typeof info> => info !== null);

      if (uploadInfos.length === 0) return;

      const fileNodes = uploadInfos.map(({ file, uploadId }) => ({
        type: 'fileAttachment' as const,
        attrs: {
          name: file.name,
          size: file.size,
          mediaId: uploadId,
          isUploading: true,
        },
      }));

      editor.chain().focus().insertContent(fileNodes).run();

      try {
        if (customFileUpload) {
          for (const { blobUrl, uploadId, file } of uploadInfos) {
            try {
              const { url, name, size } = await customFileUpload(file);
              updateFileNode(editor, uploadId, {
                url,
                name,
                size,
                isUploading: false,
              });
              URL.revokeObjectURL(blobUrl);
            } catch (error) {
              removeNodeByUploadId(editor, uploadId);
              URL.revokeObjectURL(blobUrl);

              const errorMessage =
                error instanceof Error
                  ? getUploadErrorMessage(error)
                  : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
              onError?.(errorMessage);
            }
          }
        } else {
          const results = await uploadFileBatchAsync(
            uploadInfos.map((info) => info.file)
          );

          results.forEach((result, index) => {
            const uploadInfo = uploadInfos[index];
            if (!uploadInfo) return;
            updateFileNode(editor, uploadInfo.uploadId, {
              name: result.fileName,
              size: result.sizeBytes,
              mediaId: result.mediaId,
              isUploading: false,
            });
          });
        }
      } catch (error) {
        for (const { blobUrl, uploadId } of uploadInfos) {
          removeNodeByUploadId(editor, uploadId);
          URL.revokeObjectURL(blobUrl);
        }

        const errorMessage =
          error instanceof Error
            ? getUploadErrorMessage(error)
            : UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
        onError?.(errorMessage);
      }
    },
    [customFileUpload, uploadFileBatchAsync, onError]
  );

  return {
    handleImageUpload,
    handleImageBatchUpload,
    handleFileUpload,
    handleFileBatchUpload,
  };
};

// Helper functions
function updateImageNode(
  editor: Editor,
  uploadId: string,
  updates: { src?: string; mediaId?: string; isUploading: boolean }
): void {
  let nodePos: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (
      nodePos === null &&
      node.type.name === 'image' &&
      node.attrs.mediaId === uploadId
    ) {
      nodePos = pos;
      return false;
    }
  });

  if (nodePos !== null) {
    const node = editor.state.doc.nodeAt(nodePos);
    if (node) {
      const transaction = editor.state.tr.setNodeMarkup(nodePos, undefined, {
        ...node.attrs,
        ...updates,
      });
      editor.view.dispatch(transaction);
    }
  }
}

function updateFileNode(
  editor: Editor,
  uploadId: string,
  updates: {
    url?: string;
    name?: string;
    size?: number;
    mediaId?: string;
    isUploading: boolean;
  }
): void {
  let nodePos: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (
      nodePos === null &&
      node.type.name === 'fileAttachment' &&
      node.attrs.mediaId === uploadId
    ) {
      nodePos = pos;
      return false;
    }
  });

  if (nodePos !== null) {
    const node = editor.state.doc.nodeAt(nodePos);
    if (node) {
      const transaction = editor.state.tr.setNodeMarkup(nodePos, undefined, {
        ...node.attrs,
        ...updates,
      });
      editor.view.dispatch(transaction);
    }
  }
}

function removeNodeByUploadId(editor: Editor, uploadId: string): void {
  let nodePos: number | null = null;
  let nodeSize = 0;

  editor.state.doc.descendants((node, pos) => {
    if (
      nodePos === null &&
      (node.type.name === 'image' || node.type.name === 'fileAttachment') &&
      node.attrs.mediaId === uploadId
    ) {
      nodePos = pos;
      nodeSize = node.nodeSize;
      return false;
    }
  });

  if (nodePos !== null) {
    const transaction = editor.state.tr.delete(nodePos, nodePos + nodeSize);
    editor.view.dispatch(transaction);
  }
}
