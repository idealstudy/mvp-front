import {
  FILE_UPLOAD_CONFIG,
  IMAGE_UPLOAD_CONFIG,
  SLASH_COMMAND_GROUPS,
  UPLOAD_ERROR_MESSAGES,
} from '../constants';
import { SlashCommandGroup, SlashCommandItem } from '../types';

// ============================================================================
// File Validation
// ============================================================================

/**
 * 이미지 파일 유효성 검사
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (
    !extension ||
    !(IMAGE_UPLOAD_CONFIG.allowedExtensions as readonly string[]).includes(
      extension
    )
  ) {
    return {
      valid: false,
      error: UPLOAD_ERROR_MESSAGES.IMAGE_TYPE_NOT_ALLOWED,
    };
  }

  if (
    !IMAGE_UPLOAD_CONFIG.allowedMimeTypes.includes(
      file.type as (typeof IMAGE_UPLOAD_CONFIG.allowedMimeTypes)[number]
    )
  ) {
    return {
      valid: false,
      error: UPLOAD_ERROR_MESSAGES.IMAGE_TYPE_NOT_ALLOWED,
    };
  }

  if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.IMAGE_SIZE_EXCEEDED };
  }

  return { valid: true };
};

/**
 * 첨부 파일 유효성 검사
 */
export const validateAttachmentFile = (
  file: File
): { valid: boolean; error?: string } => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (
    !extension ||
    !(FILE_UPLOAD_CONFIG.allowedExtensions as readonly string[]).includes(
      extension
    )
  ) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.FILE_TYPE_NOT_ALLOWED };
  }

  if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: UPLOAD_ERROR_MESSAGES.FILE_SIZE_EXCEEDED };
  }

  return { valid: true };
};

/**
 * URL 유효성 검사
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// Error Message Helpers
// ============================================================================

/**
 * 업로드 에러를 사용자 친화적인 메시지로 변환
 */
export const getUploadErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (message.includes('size') || message.includes('large')) {
    return UPLOAD_ERROR_MESSAGES.IMAGE_SIZE_EXCEEDED;
  }

  if (message.includes('type') || message.includes('format')) {
    return UPLOAD_ERROR_MESSAGES.IMAGE_TYPE_NOT_ALLOWED;
  }

  if (message.includes('network') || message.includes('fetch')) {
    return UPLOAD_ERROR_MESSAGES.NETWORK_ERROR;
  }

  return UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED;
};

// ============================================================================
// File Formatting
// ============================================================================

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * 파일명에서 확장자 추출
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// ============================================================================
// Slash Command Helpers
// ============================================================================

/**
 * 모든 슬래시 커맨드를 flat 배열로 반환
 */
export const getAllSlashCommands = (): SlashCommandItem[] => {
  return SLASH_COMMAND_GROUPS.flatMap((group) => group.items);
};

/**
 * 검색어로 슬래시 커맨드 필터링
 */
export const filterSlashCommands = (query: string): SlashCommandGroup[] => {
  if (!query) return SLASH_COMMAND_GROUPS;

  const lowerQuery = query.toLowerCase();

  return SLASH_COMMAND_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lowerQuery)
        )
    ),
  })).filter((group) => group.items.length > 0);
};

// ============================================================================
// Content Transform Helpers
// ============================================================================

type EditorContent = {
  type?: string;
  content?: EditorContent[];
  attrs?: Record<string, unknown>;
  [key: string]: unknown;
};

type TransformResult = {
  content: EditorContent;
  mediaIds: string[];
};

const EMPTY_EDITOR_DOC: EditorContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

const MEDIA_PROTOCOL = 'media://';

const extractMediaId = (
  attrs: Record<string, unknown> | undefined,
  key: 'src' | 'url'
): string | undefined => {
  if (!attrs) return undefined;

  const mediaId = attrs.mediaId;
  if (typeof mediaId === 'string' && mediaId) {
    return mediaId;
  }

  const value = attrs[key];
  if (typeof value === 'string' && value.startsWith(MEDIA_PROTOCOL)) {
    return value.slice(MEDIA_PROTOCOL.length);
  }

  return undefined;
};

/**
 * resolvedContent에 원본 content의 mediaId를 주입합니다.
 * - resolvedContent는 이미지/파일 URL이 S3로 치환되어 있기 때문에
 *   저장 시 필요한 mediaId를 다시 붙여줍니다.
 */
export const mergeResolvedContentWithMediaIds = (
  sourceContent: EditorContent,
  resolvedContent: EditorContent
): EditorContent => {
  const collectMediaIds = (
    node: EditorContent | undefined,
    key: 'src' | 'url',
    mediaIds: string[]
  ) => {
    if (!node) return;

    const isTargetNode =
      (key === 'src' && node.type === 'image') ||
      (key === 'url' && node.type === 'fileAttachment');

    if (isTargetNode) {
      const mediaId = extractMediaId(node.attrs, key);
      if (mediaId) {
        mediaIds.push(mediaId);
      }
    }

    if (Array.isArray(node.content)) {
      node.content.forEach((child) => collectMediaIds(child, key, mediaIds));
    }
  };

  const imageMediaIds: string[] = [];
  const fileMediaIds: string[] = [];

  collectMediaIds(sourceContent, 'src', imageMediaIds);
  collectMediaIds(sourceContent, 'url', fileMediaIds);

  const mergeNode = (resolvedNode: EditorContent): EditorContent => {
    const mergedNode: EditorContent = { ...resolvedNode };

    if (resolvedNode.type === 'image') {
      const currentMediaId = extractMediaId(resolvedNode.attrs, 'src');
      const mediaId = currentMediaId ?? imageMediaIds.shift();
      if (mediaId) {
        mergedNode.attrs = {
          ...(resolvedNode.attrs ?? {}),
          mediaId,
        };
      }
    }

    if (resolvedNode.type === 'fileAttachment') {
      const currentMediaId = extractMediaId(resolvedNode.attrs, 'url');
      const mediaId = currentMediaId ?? fileMediaIds.shift();
      if (mediaId) {
        mergedNode.attrs = {
          ...(resolvedNode.attrs ?? {}),
          mediaId,
        };
      }
    }

    if (Array.isArray(resolvedNode.content)) {
      mergedNode.content = resolvedNode.content.map(mergeNode);
    }

    return mergedNode;
  };

  return mergeNode(resolvedContent);
};

/**
 * 문자열 content를 JSONContent 형태로 파싱합니다.
 * JSON 파싱 실패 또는 유효하지 않은 구조면 텍스트 노드로 래핑합니다.
 */
export const parseEditorContent = (content: string): EditorContent => {
  if (!content) return EMPTY_EDITOR_DOC;

  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && 'type' in parsed) {
      return parsed as EditorContent;
    }

    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: String(content) }],
        },
      ],
    };
  } catch {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: content }],
        },
      ],
    };
  }
};

/**
 * 에디터 content를 저장용으로 변환합니다.
 * - 이미지 노드의 src를 media://{mediaId} 형식으로 변환
 * - 파일 첨부 노드의 url을 media://{mediaId} 형식으로 변환
 * - mediaIds 배열 추출
 *
 * @param content 에디터에서 가져온 JSONContent
 * @returns 변환된 content와 mediaIds 배열
 */
export const transformContentForSave = (
  content: EditorContent
): TransformResult => {
  const mediaIds: string[] = [];

  const transformNode = (node: EditorContent): EditorContent => {
    // 이미지 노드 처리
    if (node.type === 'image' && node.attrs) {
      const attrs = node.attrs as Record<string, unknown>;
      const mediaId = attrs.mediaId as string | undefined;

      if (mediaId) {
        mediaIds.push(mediaId);
        // src를 media://{mediaId} 형식으로 변환하고, 원본 mediaId 속성은 제거
        return {
          ...node,
          attrs: {
            ...attrs,
            src: `media://${mediaId}`,
            mediaId: undefined, // 저장 시 mediaId 속성 제거
          },
        };
      }
    }

    // 파일 첨부 노드 처리
    if (node.type === 'fileAttachment' && node.attrs) {
      const attrs = node.attrs as Record<string, unknown>;
      const mediaId = attrs.mediaId as string | undefined;

      if (mediaId) {
        mediaIds.push(mediaId);
        // url을 media://{mediaId} 형식으로 변환하고, 원본 mediaId 속성은 제거
        return {
          ...node,
          attrs: {
            ...attrs,
            url: `media://${mediaId}`,
            mediaId: undefined, // 저장 시 mediaId 속성 제거
          },
        };
      }
    }

    // 자식 노드가 있으면 재귀적으로 처리
    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(transformNode),
      };
    }

    return node;
  };

  return {
    content: transformNode(content),
    mediaIds,
  };
};

/**
 * 저장용 content JSON 문자열과 mediaIds를 반환합니다.
 *
 * @param content 에디터에서 가져온 JSONContent
 * @returns { contentString, mediaIds }
 */
export const prepareContentForSave = (
  content: EditorContent
): { contentString: string; mediaIds: string[] } => {
  const { content: transformedContent, mediaIds } =
    transformContentForSave(content);

  return {
    contentString: JSON.stringify(transformedContent),
    mediaIds,
  };
};
