import { cookies } from 'next/headers';

import { serverEnv } from '@/shared/constants/api';
import { OG_THEME, createOgImage } from '@/shared/lib/og';
import type { CommonResponse } from '@/types/http';

const DEFAULT_TITLE = '수업노트';
const SESSION_COOKIE_NAMES = new Set(['Authorization', 'refresh', 'sid']);

type RouteContext = {
  params: Promise<{ noteId: string }>;
};

type StudyNoteTitleResponse = CommonResponse<{
  title: string;
}>;

export async function GET(request: Request, { params }: RouteContext) {
  const { noteId } = await params;
  const title = await getStudyNoteTitle(Number(noteId));

  return createOgImage({
    title,
    theme: OG_THEME.STUDYNOTE,
    origin: new URL(request.url).origin,
  });
}

const getStudyNoteTitle = async (noteId: number) => {
  if (Number.isNaN(noteId)) return DEFAULT_TITLE;

  try {
    return await fetchStudyNoteTitle(noteId);
  } catch {
    return DEFAULT_TITLE;
  }
};

const fetchStudyNoteTitle = async (noteId: number) => {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return DEFAULT_TITLE;

  const response = await fetch(
    `${serverEnv.backendApiUrl}/common/teaching-notes/${noteId}`,
    {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }
  );

  if (!response.ok) return DEFAULT_TITLE;

  const payload = (await response.json()) as StudyNoteTitleResponse;
  return payload.data.title;
};

// 수업노트 제목을 가져오기 위해서 세션 쿠키도 필요
const getSessionCookieHeader = async () => {
  const cookieJar = await cookies();

  return cookieJar
    .getAll()
    .filter((cookie) => SESSION_COOKIE_NAMES.has(cookie.name))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
};
