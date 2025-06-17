import * as jose from 'jose';

import { Session } from '../type';
import { getSessionToken } from './session-token';

export const parseSession = (token: string): Session => {
  const decoded = jose.decodeJwt(token);
  return Session.parse(decoded);
};

export const getSession = () => {
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return null;
  }

  try {
    return parseSession(sessionToken);
  } catch {
    return null;
  }
};
