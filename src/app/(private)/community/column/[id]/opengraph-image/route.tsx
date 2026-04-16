import { serverEnv } from '@/shared/constants/api';
import { OG_THEME, createOgImage } from '@/shared/lib/og';
import type { CommonResponse } from '@/types/http';

const DEFAULT_TITLE = '컬럼';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ColumnTitleResponse = CommonResponse<{
  title: string;
}>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const title = await getColumnTitle(Number(id));

  return createOgImage({
    title,
    theme: OG_THEME.COLUMN,
  });
}

const getColumnTitle = async (columnId: number) => {
  if (Number.isNaN(columnId)) return DEFAULT_TITLE;

  try {
    return await fetchColumnTitle(columnId);
  } catch {
    return DEFAULT_TITLE;
  }
};

const fetchColumnTitle = async (columnId: number) => {
  const response = await fetch(
    `${serverEnv.backendApiUrl}/public/column-articles/${columnId}`,
    { cache: 'no-store' }
  );

  if (!response.ok) return DEFAULT_TITLE;

  const payload = (await response.json()) as ColumnTitleResponse;
  return payload.data.title;
};
