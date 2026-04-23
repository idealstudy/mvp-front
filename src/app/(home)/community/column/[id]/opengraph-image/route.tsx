import { repository } from '@/entities/column';
import { OG_PRESETS, createOgImage } from '@/shared/lib/og';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const origin = new URL(request.url).origin;
  const title = await getColumnOgTitle(Number(id));

  return createOgImage({
    preset: {
      ...OG_PRESETS.COLUMN,
      title,
    },
    origin,
  });
}

// 컬럼의 제목을 가져오는 함수
const getColumnOgTitle = async (id: number) => {
  if (Number.isNaN(id)) return OG_PRESETS.COLUMN.title;

  try {
    const column = await repository.getColumnDetail(id);
    return column.title || OG_PRESETS.COLUMN.title;
  } catch {
    return OG_PRESETS.COLUMN.title;
  }
};
