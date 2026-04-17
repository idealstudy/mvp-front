export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_ASSETS = {
  logo: '/og/og-logo.png',
} as const;

export const OG_PRESETS = {
  STUDY_NOTE: {
    title: '한눈에 정리되는\n수업노트',
    image: '/og/og-note.png',
    imageAlt: '수업노트',
  },
  HOMEWORK: {
    title: '실력을 늘리는 과제',
    image: '/og/og-homework.png',
    imageAlt: '과제',
  },
  COLUMN: {
    title: '놓치기 아까운\n칼럼 게시글',
    image: '/og/og-column.png',
    imageAlt: '칼럼',
  },
} as const;

export type OgPreset = (typeof OG_PRESETS)[keyof typeof OG_PRESETS];
