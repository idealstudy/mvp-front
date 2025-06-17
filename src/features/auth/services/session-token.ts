import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/local-storage';

export const getSessionToken = () => {
  return getLocalStorage('accessToken');
};

export const saveSessionToken = (token: string) => {
  setLocalStorage('accessToken', token);
};

export const removeSessionToken = () => {
  removeLocalStorage('accessToken');
};
