import { NextRequest, NextResponse } from 'next/server';

// CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://app.dev.the-edu.site',
  'https://the-edu.vercel.app',
  'https://the-edu-dev.vercel.app',
  'https://dev.the-edu.site',
  'https://d-edu.site',
];
const createCorsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Custom-Header',
  'Access-Control-Allow-Credentials': 'true',
});

const PUBLIC_PATHS = new Set<string>([
  '/',
  '/login',
  '/register',
  '/api/v1/auth/login',
]);

// 인프라(next.js)
function isInfraRequest(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  return (
    // req.method === 'OPTIONS' ||
    req.headers.get('next-router-prefetch') === '1' ||
    req.headers.get('purpose') === 'prefetch' ||
    req.headers.get('rsc') === '1' ||
    searchParams.has('_rsc') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

// 인증 없으면 로그인으로
function handleAuthGuard(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('Authorization')?.value;
  // const refreshToken = req.cookies.get('refresh')?.value;

  if (!accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  if (req.method === 'OPTIONS') {
    const reqOrigin = req.headers.get('origin') || origin;
    let allowedOrigin = reqOrigin;

    if (!ALLOWED_ORIGINS.includes(reqOrigin)) {
      allowedOrigin = ALLOWED_ORIGINS[0] || '*';
    }

    const corsHeaders = createCorsHeaders(allowedOrigin);

    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // 개발용
  if (process.env.NODE_ENV !== 'production') return NextResponse.next();
  if (isInfraRequest(req)) return NextResponse.next();

  // 공개 경로 통과
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  // 인증 가드
  return handleAuthGuard(req);
}

export const config = {
  matcher: ['/', '/api/:path*', '/dashboard/:path*', '/study-rooms/:path*'],
};
