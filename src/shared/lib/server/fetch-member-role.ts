'use server';

import { cookies } from 'next/headers';

import { serverEnv } from '@/shared/constants/api';

export type SessionStatus =
  | { status: 'authenticated'; role: string; name: string }
  | { status: 'stale' }
  | { status: 'guest' };

export async function fetchMemberRole(): Promise<SessionStatus> {
  const cookieJar = await cookies();
  const hasAuthCookie = !!(
    cookieJar.get('Authorization') ??
    cookieJar.get('refresh') ??
    cookieJar.get('sid')
  );

  if (!hasAuthCookie) return { status: 'guest' };

  const SESSION_COOKIES = new Set(['Authorization', 'refresh']);
  const cookieHeader = cookieJar
    .getAll()
    .filter((c) => SESSION_COOKIES.has(c.name))
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const res = await fetch(`${serverEnv.backendApiUrl}/members/info`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403) return { status: 'stale' };

    if (res.ok && res.status !== 204) {
      const data = (await res.json())?.data;

      if (data?.role)
        return {
          status: 'authenticated',
          role: data.role,
          name: data.name ?? '',
        };
    }
  } catch {
    // 네트워크 오류 등 → guest 처리
  }

  return { status: 'guest' };
}
