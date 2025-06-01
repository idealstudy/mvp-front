'use server';

import { cookies } from 'next/headers';

import { decodeToken } from './utils';

const SECOND = 1000;

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
} as const;

export const setCookie = async ({
  name,
  value,
  expires,
}: {
  name: string;
  value: string;
  expires?: number | Date;
}) => {
  const cookieStore = await cookies();
  cookieStore.set({
    ...COOKIE_OPTIONS,
    name,
    value,
    expires,
  });
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete({
    ...COOKIE_OPTIONS,
    name,
  });
};

export const hasCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.has(name);
};

export const setJwtCookies = async (accessToken: string) => {
  const { exp: accessTokenExp } = decodeToken(accessToken);
  const accessTokenExpDate = new Date(accessTokenExp * SECOND);

  await setCookie({
    name: 'accessToken',
    value: accessToken,
    expires: accessTokenExpDate,
  });
};

export const deleteJwtCookies = async () => {
  await deleteCookie('accessToken');
};

export const decodedJWTCookie = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return null;

  try {
    const user = decodeToken(token);
    return user;
  } catch {
    throw new Error('Cookie Decoded Error!');
  }
};
