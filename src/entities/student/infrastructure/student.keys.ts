export const studentKeys = {
  all: ['student'] as const,
  basicInfo: () => [...studentKeys.all, 'basicInfo'] as const,
};
