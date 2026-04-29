import { NextRequest, NextResponse } from 'next/server';

import { serverEnv } from '@/shared/constants/api';
import { applySetCookies, extractErrorMessage, safeJson } from '@/shared/lib';

if (!serverEnv.backendApiUrl) throw new Error('BASE_URL is not defined');

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const logoutResponse = await fetch(`${serverEnv.backendApiUrl}/auth/logout`, {
    method: 'POST',
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });

  const payload = await safeJson(logoutResponse);

  const response =
    logoutResponse.status === 204
      ? new NextResponse(null, { status: logoutResponse.status })
      : NextResponse.json(payload ?? null, {
          status: logoutResponse.status,
          headers: {
            'Content-Type':
              logoutResponse.headers.get('Content-Type') ?? 'application/json',
          },
        });

  applySetCookies(logoutResponse, response);

  if (!logoutResponse.ok && logoutResponse.status !== 204) {
    const message = extractErrorMessage(payload) ?? '로그아웃에 실패했습니다.';
    const errorResponse = NextResponse.json(
      { message },
      { status: logoutResponse.status }
    );
    applySetCookies(logoutResponse, errorResponse);
    return errorResponse;
  }

  return response;
}
