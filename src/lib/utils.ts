import { JWT } from '@/features/auth/type';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const validateJwtFormat = (token: string): [string, string, string] => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  return parts as [string, string, string];
};

export const decodeToken = <T = JWT>(token: string): T => {
  try {
    const [, payload] = validateJwtFormat(token);
    return JSON.parse(atob(payload));
  } catch {
    throw new Error('Invalid token');
  }
};

export function parseJson<T>(
  value: string,
  fallback: T | null = null
): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
