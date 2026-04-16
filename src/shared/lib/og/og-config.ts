export const OG_THEME = {
  STUDYNOTE: {
    image: '/og/og-note.png',
    label: '수업노트',
    backgroundColor: '#FCFBFA',
    bottomBarColor: '#F6EDE4',
  },
  HOMEWORK: {
    image: '/og/og-homework.png',
    label: '과제',
    backgroundColor: '#FCFBFA',
    bottomBarColor: '#F6EDE4',
  },
  COLUMN: {
    image: '/og/og-column.png',
    label: '컬럼',
    backgroundColor: '#FCFBFA',
    bottomBarColor: '#F6EDE4',
  },
} as const;

export type OgTheme = (typeof OG_THEME)[keyof typeof OG_THEME];
