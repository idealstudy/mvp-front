export const profileImageKeys = {
  all: ['profileImage'] as const,
  detail: () => [...profileImageKeys.all, 'detail'] as const,
};
