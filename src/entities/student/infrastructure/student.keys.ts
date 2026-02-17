export const studentKeys = {
  all: ['student'] as const,
  report: () => [...studentKeys.all, 'report'] as const,
};
