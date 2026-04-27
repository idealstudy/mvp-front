export const SubjectQueryKey = {
  all: ['subject'] as const,
  list: () => [...SubjectQueryKey.all, 'list'] as const,
} as const;
