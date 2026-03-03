import { api } from '@/shared/api';

import { getEmbedTypeFromUrl } from '../model/embed-extension';
import { LinkEmbedResponse, SlashCommandGroup } from '../types';

// ============================================================================
// Image Upload Config
// ============================================================================

export const IMAGE_UPLOAD_CONFIG = {
  /** 허용 확장자 */
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  /** 허용 MIME 타입 */
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ] as const,
  /** 최대 파일 크기 (5MB) */
  maxFileSize: 5 * 1024 * 1024,
  /** 최대 파일 크기 (표시용) */
  maxFileSizeLabel: '5MB',
} as const;

// ============================================================================
// File Upload Config
// ============================================================================

export const FILE_UPLOAD_CONFIG = {
  /** 허용 확장자 */
  allowedExtensions: ['pdf', 'docx', 'pptx', 'hwp', 'hwpx', 'xlsx', 'zip'],
  /** 허용 MIME 타입 */
  allowedMimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-hwp',
    'application/haansofthwp',
    'application/vnd.hancom.hwp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed',
  ] as const,
  /** 최대 파일 크기 (30MB) */
  maxFileSize: 30 * 1024 * 1024,
  /** 최대 파일 크기 (표시용) */
  maxFileSizeLabel: '30MB',
} as const;

// ============================================================================
// File Icon Mapping
// ============================================================================

export const FILE_ICON_MAP: Record<string, string> = {
  pdf: 'file-text',
  docx: 'file-text',
  pptx: 'presentation',
  hwp: 'file-text',
  hwpx: 'file-text',
  xlsx: 'table',
  zip: 'archive',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const UPLOAD_ERROR_MESSAGES = {
  IMAGE_SIZE_EXCEEDED: `이미지 용량이 ${IMAGE_UPLOAD_CONFIG.maxFileSizeLabel}를 초과했습니다.`,
  IMAGE_TYPE_NOT_ALLOWED:
    '지원하지 않는 이미지 형식입니다. (jpg, png, gif, webp만 가능)',
  FILE_SIZE_EXCEEDED: `파일 용량이 ${FILE_UPLOAD_CONFIG.maxFileSizeLabel}를 초과했습니다.`,
  FILE_TYPE_NOT_ALLOWED: '지원하지 않는 파일 형식입니다.',
  UPLOAD_FAILED: '업로드에 실패했습니다. 다시 시도해주세요.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  INVALID_URL: '잘못된 URL 형식입니다.',
} as const;

// ============================================================================
// Slash Commands
// ============================================================================

export const SLASH_COMMAND_GROUPS: SlashCommandGroup[] = [
  {
    title: '기본 블록',
    items: [
      {
        id: 'text',
        title: '텍스트',
        description: '일반 텍스트로 작성을 시작합니다.',
        icon: 'text',
        keywords: ['text', 'paragraph', '텍스트', '문단'],
        command: (editor) => {
          editor.chain().focus().setParagraph().run();
        },
      },
      {
        id: 'heading1',
        title: '제목 1',
        description: '큰 제목을 추가합니다.',
        icon: 'heading1',
        keywords: ['heading', 'h1', '제목', '헤딩', 'title'],
        command: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        id: 'heading2',
        title: '제목 2',
        description: '중간 크기 제목을 추가합니다.',
        icon: 'heading2',
        keywords: ['heading', 'h2', '제목', '헤딩', 'subtitle'],
        command: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        id: 'heading3',
        title: '제목 3',
        description: '작은 제목을 추가합니다.',
        icon: 'heading3',
        keywords: ['heading', 'h3', '제목', '헤딩'],
        command: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
    ],
  },
  {
    title: '리스트',
    items: [
      {
        id: 'bulletList',
        title: '글머리 기호 목록',
        description: '간단한 글머리 기호 목록을 만듭니다.',
        icon: 'bulletList',
        keywords: ['bullet', 'list', 'ul', '목록', '리스트', '글머리'],
        command: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        id: 'numberedList',
        title: '번호 매기기 목록',
        description: '번호가 매겨진 목록을 만듭니다.',
        icon: 'numberedList',
        keywords: ['numbered', 'list', 'ol', '번호', '목록', '리스트'],
        command: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        id: 'taskList',
        title: '할 일 목록',
        description: '할 일 체크리스트를 만듭니다.',
        icon: 'taskList',
        keywords: ['task', 'todo', 'checklist', '할일', '체크', '목록'],
        command: (editor) => {
          editor.chain().focus().toggleTaskList().run();
        },
      },
    ],
  },
  {
    title: '미디어',
    items: [
      {
        id: 'image',
        title: '이미지',
        description: '이미지를 업로드하거나 링크로 추가합니다.',
        icon: 'image',
        keywords: ['image', 'img', 'picture', '이미지', '사진', '그림'],
        command: (editor) => {
          const url = window.prompt('이미지 URL을 입력하세요:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        },
      },
      {
        id: 'link',
        title: '링크',
        description: '웹 링크를 추가합니다.',
        icon: 'link',
        keywords: ['link', 'url', 'href', '링크', '주소'],
        command: (editor) => {
          const url = window.prompt('링크 URL을 입력하세요:');
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
          }
        },
      },
      {
        id: 'embed',
        title: '동영상 임베드',
        description: 'YouTube, Vimeo 동영상을 삽입합니다.',
        icon: 'video',
        keywords: [
          'video',
          'youtube',
          'vimeo',
          'embed',
          '동영상',
          '비디오',
          '유튜브',
        ],
        command: (editor) => {
          const url = window.prompt('YouTube 또는 Vimeo URL을 입력하세요:');
          if (url) {
            import('../model/embed-extension').then(({ parseEmbedUrl }) => {
              const parsed = parseEmbedUrl(url);
              if (parsed) {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: 'embed',
                    attrs: {
                      url,
                      type: parsed.type,
                      embedUrl: parsed.embedUrl,
                    },
                  })
                  .run();
              }
            });
          }
        },
      },
      {
        id: 'linkPreview',
        title: '링크 미리보기',
        description: 'URL의 미리보기 카드를 삽입합니다.',
        icon: 'externalLink',
        keywords: ['preview', 'card', 'og', '미리보기', '카드', '프리뷰'],
        command: async (editor) => {
          const url = window.prompt('URL을 입력하세요:');
          if (url) {
            try {
              // 로딩 상태로 먼저 삽입
              editor
                .chain()
                .focus()
                .insertContent({
                  type: 'linkPreview',
                  attrs: {
                    url,
                    loading: true,
                  },
                })
                .run();

              // API 호출
              const result = await api.private.post<LinkEmbedResponse>(
                '/common/link-embeds/preview',
                { url }
              );

              // 문서에서 loading=true인 linkPreview 노드를 찾아서 교체
              const { state } = editor;
              let foundPos: number | null = null;

              state.doc.descendants((node, pos) => {
                if (
                  node.type.name === 'linkPreview' &&
                  node.attrs.url === url &&
                  node.attrs.loading === true
                ) {
                  foundPos = pos;
                  return false; // 찾았으면 순회 중단
                }
              });

              if (foundPos !== null) {
                const tr = state.tr;
                if (result.data.available && result.data.embed) {
                  const { embed } = result.data;
                  if (
                    embed.embedType === 'OEMBED' &&
                    embed.embedUrl &&
                    state.schema.nodes.embed
                  ) {
                    tr.setNodeMarkup(foundPos, state.schema.nodes.embed, {
                      url: embed.url,
                      type: getEmbedTypeFromUrl(embed.embedUrl),
                      embedUrl: embed.embedUrl,
                      title: embed.title,
                    });
                  } else {
                    // available: true → 링크 미리보기 카드로 업데이트
                    tr.setNodeMarkup(foundPos, undefined, {
                      url: embed.url,
                      title: embed.title,
                      description: embed.description,
                      image: embed.imageUrl,
                      siteName: embed.siteName,
                      loading: false,
                    });
                  }
                } else {
                  // available: false → 노드 삭제하고 일반 링크로 교체
                  const node = state.doc.nodeAt(foundPos);
                  if (node && state.schema.marks.link) {
                    tr.delete(foundPos, foundPos + node.nodeSize);
                    tr.insertText(url, foundPos);
                    tr.addMark(
                      foundPos,
                      foundPos + url.length,
                      state.schema.marks.link.create({ href: url })
                    );
                  }
                }
                editor.view.dispatch(tr);
              }
            } catch {
              // 에러 발생 시 loading 노드 찾아서 일반 링크로 교체
              const { state } = editor;
              let foundPos: number | null = null;

              state.doc.descendants((node, pos) => {
                if (
                  node.type.name === 'linkPreview' &&
                  node.attrs.url === url &&
                  node.attrs.loading === true
                ) {
                  foundPos = pos;
                  return false;
                }
              });

              if (foundPos !== null) {
                const tr = state.tr;
                const node = state.doc.nodeAt(foundPos);
                if (node && state.schema.marks.link) {
                  tr.delete(foundPos, foundPos + node.nodeSize);
                  tr.insertText(url, foundPos);
                  tr.addMark(
                    foundPos,
                    foundPos + url.length,
                    state.schema.marks.link.create({ href: url })
                  );
                }
                editor.view.dispatch(tr);
              }
            }
          }
        },
      },
    ],
  },
  {
    title: '고급 블록',
    items: [
      {
        id: 'codeBlock',
        title: '코드 블록',
        description: '코드 스니펫을 추가합니다.',
        icon: 'code',
        keywords: ['code', 'codeblock', '코드', '스니펫'],
        command: (editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
      {
        id: 'blockquote',
        title: '인용',
        description: '인용문을 추가합니다.',
        icon: 'quote',
        keywords: ['quote', 'blockquote', '인용', '인용문'],
        command: (editor) => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        id: 'divider',
        title: '구분선',
        description: '콘텐츠를 구분하는 수평선을 추가합니다.',
        icon: 'divider',
        keywords: ['divider', 'hr', 'horizontal', '구분선', '수평선', '선'],
        command: (editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
    ],
  },
];
