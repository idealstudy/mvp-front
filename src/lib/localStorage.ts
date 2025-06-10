import { decodeToken } from './utils';

export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const removeLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const hasLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) !== null;
  }
  return false;
};

export const decodedJWTStorage = async () => {
  if (typeof window !== 'undefined') {
    const token = getLocalStorage('accessToken');
    if (!token) return null;
    const user = decodeToken(token);
    return user;
  }
};
