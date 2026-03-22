import { Editor, JSONContent } from '@tiptap/react';

// ============================================================================
// Editor Core Types
// ============================================================================

/** 에디터 콘텐츠 값 타입 */
export type TextEditorValue = JSONContent;

/** 기본 에디터 Props */
export type TextEditorProps = {
  className?: string;
  value: TextEditorValue;
  onChange: (value: TextEditorValue) => void;
  placeholder?: string;
};

/** 뷰어 Props */
export type TextViewerProps = {
  className?: string;
  value: TextEditorValue;
};

/** 툴바 Props */
export type ToolbarProps = {
  editor: Editor;
};

/** Notion 스타일 에디터 Props */
export type NotionEditorProps = TextEditorProps & {
  /** 다크모드 활성화 */
  darkMode?: boolean;
  /** 자동 포커스 */
  autoFocus?: boolean;
  /** 슬래시 커맨드 활성화 */
  enableSlashCommand?: boolean;
  /** 툴바 표시 여부 */
  showToolbar?: boolean;
  /** 버블 메뉴 표시 여부 */
  showBubbleMenu?: boolean;
  /** 최소 높이 */
  minHeight?: string;
  /** 최대 높이 */
  maxHeight?: string;
  /** 읽기 전용 */
  readOnly?: boolean;
  /** 미디어 업로드 타겟 타입 */
  targetType?: MediaTargetType;
  /** 커스텀 이미지 업로드 핸들러 (제공하지 않으면 기본 API 사용) */
  onImageUpload?: (file: File) => Promise<string>;
  /** 커스텀 파일 업로드 핸들러 */
  onFileUpload?: (
    file: File
  ) => Promise<{ url: string; name: string; size: number }>;
  /** 에러 핸들러 */
  onError?: (message: string) => void;
  /** 접근성 레이블 */
  ariaLabel?: string;
};

// ============================================================================
// Auto Save Types
// ============================================================================

/** 자동 저장 상태 */
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** useAutoSave 훅 옵션 */
export type UseAutoSaveOptions = {
  /** 자동 저장 활성화 여부 */
  enabled?: boolean;
  /** 디바운스 딜레이 (ms) */
  debounceMs?: number;
  /** 저장 함수 */
  onSave: (value: TextEditorValue) => Promise<void>;
  /** 저장 성공 콜백 */
  onSaveSuccess?: () => void;
  /** 저장 실패 콜백 */
  onSaveError?: (error: Error) => void;
};

/** useAutoSave 훅 반환값 */
export type UseAutoSaveReturn = {
  /** 현재 저장 상태 */
  status: AutoSaveStatus;
  /** 마지막 저장 시간 */
  lastSavedAt: Date | null;
  /** 변경 사항 있음 여부 */
  hasUnsavedChanges: boolean;
  /** 수동 저장 트리거 */
  saveNow: () => Promise<void>;
  /** 값 변경 핸들러 */
  handleChange: (value: TextEditorValue) => void;
};

// ============================================================================
// Upload Types
// ============================================================================

/** 미디어 타겟 타입 */
export type MediaTargetType =
  | 'TEACHING_NOTE'
  | 'QNA'
  | 'HOMEWORK'
  | 'HOMEWORK_SUBMISSION'
  | 'HOMEWORK_FEEDBACK';

/** Presign 요청용 미디어 에셋 */
export type PresignMediaAsset = {
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

/** Presign 요청 Body */
export type PresignBatchRequest = {
  targetType: MediaTargetType;
  mediaAssetList: PresignMediaAsset[];
};

/** Presign 응답 미디어 에셋 */
export type PresignMediaAssetResponse = {
  fileName: string;
  mediaId: string;
  uploadUrl: string;
  headers: Record<string, string>;
};

/** Presign 응답 */
export type PresignBatchResponse = {
  status: number;
  message: string;
  data: {
    mediaAssetList: PresignMediaAssetResponse[];
  };
};

/** 미디어 업로드 결과 */
export type MediaUploadResult = {
  mediaId: string;
  mediaUrl: string; // media://{mediaId} 형식 (저장용)
  fileName: string;
  sizeBytes: number;
};

/** useImageUpload 훅 옵션 */
export type UseImageUploadOptions = {
  targetType?: MediaTargetType;
  onSuccess?: (result: MediaUploadResult) => void;
  onError?: (error: Error) => void;
};

/** useFileUpload 훅 옵션 */
export type UseFileUploadOptions = {
  targetType?: MediaTargetType;
  onSuccess?: (result: MediaUploadResult) => void;
  onError?: (error: Error) => void;
};

/** 파일 유효성 검사 결과 */
export type FileValidationResult = {
  valid: boolean;
  error?: string;
};

// Legacy types for backward compatibility
/** @deprecated Use MediaUploadResult instead */
export type UploadImageResponse = {
  url: string;
};

/** @deprecated Use PresignMediaAsset instead */
export type UploadImageParams = {
  file: File;
};

/** @deprecated Use MediaUploadResult instead */
export type FileUploadResponse = {
  url: string;
  name: string;
  size: number;
};

/** @deprecated Use PresignMediaAsset instead */
export type FileUploadParams = {
  file: File;
};

// ============================================================================
// Link Preview Types
// ============================================================================

/** 링크 미리보기 데이터 */
export type LinkPreviewData = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  embedType?: string;
  embedUrl?: string;
};

/** 링크 임베드 API 응답 */
export type LinkEmbedResponse = {
  status: number;
  message: string;
  data: {
    available: boolean;
    embed: {
      id: number;
      url: string;
      embedType?: string;
      embedUrl?: string;
      title: string;
      description: string;
      siteName: string;
      imageUrl: string;
      faviconUrl: string;
      fetchedAt: string;
    } | null;
  };
};

/** useLinkPreview 훅 옵션 */
export type UseLinkPreviewOptions = {
  onSuccess?: (data: LinkPreviewData) => void;
  onError?: (error: Error) => void;
};

// ============================================================================
// Slash Command Types
// ============================================================================

/** 슬래시 커맨드 아이템 */
export type SlashCommandItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  command: (editor: Editor) => void;
};

/** 슬래시 커맨드 그룹 */
export type SlashCommandGroup = {
  title: string;
  items: SlashCommandItem[];
};
