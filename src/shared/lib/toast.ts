const shownErrors = new Set<string>();

export const ShowErrorToast = (key: string, message: string) => {
  if (shownErrors.has(key)) return;

  shownErrors.add(key);
  void import('react-toastify').then(({ toast }) => {
    toast.error(message);
  });

  setTimeout(() => {
    shownErrors.delete(key);
  }, 3000);
};
