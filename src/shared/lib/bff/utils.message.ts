export const extractErrorMessage = (payload: unknown): string | undefined => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    return (payload as { message: string }).message;
  }

  return undefined;
};

export const extractErrorCode = (payload: unknown): string | undefined => {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    return (payload as { code: string }).code;
  }

  return undefined;
};
