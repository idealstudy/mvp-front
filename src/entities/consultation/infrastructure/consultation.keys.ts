export const consultationKeys = {
  all: ['consultation'] as const,
  detail: (id: number) => [...consultationKeys.all, 'detail', id] as const,
};
