import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { serverEnv } from '@/shared/constants/api';
import {
  applySetCookies,
  extractErrorCode,
  extractErrorMessage,
  safeJson,
} from '@/shared/lib';

if (!serverEnv.backendApiUrl) throw new Error('BASE_URL is not defined');

/**
 * BFF Catch-all Route Handler
 *
 * 모든 /api/v1/* 요청을 백엔드로 프록시합니다.
 * - 로컬 환경: localhost 쿠키로 변환하여 저장
 * - 프로덕션: 백엔드 쿠키 그대로 전달
 *
 * 특정 라우트(/api/v1/auth/login 등)가 있으면 해당 라우트가 우선 처리됩니다.
 */
/**
 * ROLE_* 값을 API 경로 prefix로 변환
 * - ROLE_TEACHER → teacher
 * - ROLE_STUDENT → student
 */
function normalizeRoleInPath(segments: string[]): string[] {
  return segments.map((segment) => {
    if (segment === 'ROLE_TEACHER') return 'teacher';
    if (segment === 'ROLE_STUDENT') return 'student';
    return segment;
  });
}

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { method, headers } = request; // body는 사용하지 않음
  const { searchParams } = request.nextUrl;
  const params = await context.params;
  const pathSegments = params.path;
  // ROLE_* 값을 API 경로 prefix로 변환
  const normalizedSegments = normalizeRoleInPath(pathSegments);
  const backendPath = `/${normalizedSegments.join('/')}`;

  // 쿼리 파라미터 추가
  const queryString = searchParams.toString();
  const backendUrl = `${serverEnv.backendApiUrl}${backendPath}${queryString ? `?${queryString}` : ''}`;

  // 쿠키 수집 및 전달
  const cookieJar = await cookies();
  const allow = new Set(['Authorization', 'refresh', 'sid']);
  const cookieHeader = cookieJar
    .getAll()
    .filter((cookie) => allow.has(cookie.name))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  // 요청 헤더 준비
  const requestHeaders: HeadersInit = {};

  // Content-Type은 본문이 있을 때만 설정
  const contentType = headers.get('Content-Type');
  if (contentType) {
    requestHeaders['Content-Type'] = contentType;
  } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (cookieHeader) {
    requestHeaders['Cookie'] = cookieHeader;
  }

  // 요청 본문 처리
  let requestBody: string | undefined;
  if (
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE'
  ) {
    try {
      requestBody = await request.text();
    } catch {
      // 본문이 없거나 읽을 수 없는 경우
      requestBody = undefined;
    }
  }

  // 개발 환경에서 백엔드 요청 로그
  console.log('[BFF] → Backend Request:', {
    method,
    url: backendUrl,
    hasCookies: !!cookieHeader,
    hasBody: !!requestBody,
    cookieNames: cookieHeader
      ? cookieHeader
          .split(';')
          .map((c) => c.split('=')[0]?.trim() ?? '')
          .filter(Boolean)
      : [],
  });

  // 백엔드로 요청 전송
  const backendResponse = await fetch(backendUrl, {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: 'no-store',
  });

  // 개발 환경에서 백엔드 응답 로그
  const responseClone = backendResponse.clone();
  const responseText: string = await responseClone.text();
  console.log('[BFF] ← Backend Response:', {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    bodyLength: responseText.length,
    preview: responseText.substring(0, 300),
  });

  // 응답 본문 파싱
  const payload = await safeJson(backendResponse);

  // 에러 응답 처리
  if (!backendResponse.ok) {
    const message = extractErrorMessage(payload) ?? '요청 처리에 실패했습니다.';
    const code = extractErrorCode(payload);
    const errorResponse = NextResponse.json(
      { code, message },
      { status: backendResponse.status }
    );
    // 에러 응답에도 쿠키 적용 (리프레시 토큰 등)
    applySetCookies(backendResponse, errorResponse);
    return errorResponse;
  }

  // 성공 응답 처리
  let response: NextResponse;
  if (backendResponse.status === 204) {
    response = new NextResponse(null, { status: 204 });
  } else {
    response = NextResponse.json(payload ?? null, {
      status: backendResponse.status,
      headers: {
        'Content-Type':
          backendResponse.headers.get('Content-Type') ?? 'application/json',
      },
    });
  }

  // 쿠키 적용 (로컬 환경에서는 Domain 제거)
  applySetCookies(backendResponse, response);

  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, context);
}
