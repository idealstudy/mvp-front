import { cookies } from 'next/headers';

import { serverEnv } from '@/shared/constants/api';
import { OG_THEME, createOgImage } from '@/shared/lib/og';
import type { CommonResponse } from '@/types/http';

const DEFAULT_TITLE = '과제';
const SESSION_COOKIE_NAMES = new Set(['Authorization', 'refresh', 'sid']);

type RouteContext = {
  params: Promise<{ id: string; homeworkId: string }>;
};

type HomeworkTitleResponse = CommonResponse<{
  homework: {
    title: string;
  };
}>;

type HomeworkRole = 'teacher' | 'student';

export async function GET(_request: Request, { params }: RouteContext) {
  const { id, homeworkId } = await params;
  const title = await getHomeworkTitle(Number(id), Number(homeworkId));

  return createOgImage({
    title,
    theme: OG_THEME.HOMEWORK,
  });
}

const getHomeworkTitle = async (studyRoomId: number, homeworkId: number) => {
  if (Number.isNaN(studyRoomId) || Number.isNaN(homeworkId)) {
    return DEFAULT_TITLE;
  }

  try {
    return await fetchHomeworkTitle(studyRoomId, homeworkId);
  } catch {
    return DEFAULT_TITLE;
  }
};

const fetchHomeworkTitle = async (studyRoomId: number, homeworkId: number) => {
  const cookieHeader = await getSessionCookieHeader();
  if (!cookieHeader) return DEFAULT_TITLE;

  const teacherTitle = await fetchHomeworkTitleByRole({
    role: 'teacher',
    studyRoomId,
    homeworkId,
    cookieHeader,
  });

  if (teacherTitle) return teacherTitle;

  return (
    (await fetchHomeworkTitleByRole({
      role: 'student',
      studyRoomId,
      homeworkId,
      cookieHeader,
    })) ?? DEFAULT_TITLE
  );
};

const fetchHomeworkTitleByRole = async ({
  role,
  studyRoomId,
  homeworkId,
  cookieHeader,
}: {
  role: HomeworkRole;
  studyRoomId: number;
  homeworkId: number;
  cookieHeader: string;
}) => {
  const response = await fetch(
    `${serverEnv.backendApiUrl}/${role}/study-rooms/${studyRoomId}/homeworks/${homeworkId}`,
    {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as HomeworkTitleResponse;
  return payload.data.homework.title;
};

const getSessionCookieHeader = async () => {
  const cookieJar = await cookies();

  return cookieJar
    .getAll()
    .filter((cookie) => SESSION_COOKIE_NAMES.has(cookie.name))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
};
