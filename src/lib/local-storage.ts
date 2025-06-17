type StorageKey = 'accessToken';

export const getLocalStorage = (key: StorageKey) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalStorage = (key: StorageKey, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const removeLocalStorage = (key: StorageKey) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
