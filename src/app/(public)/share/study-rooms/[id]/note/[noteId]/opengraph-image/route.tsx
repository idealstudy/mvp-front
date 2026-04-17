import { OG_THEME, createOgImage } from '@/shared/lib/og';

export async function GET(request: Request) {
  return createOgImage({
    title: '수업노트',
    theme: OG_THEME.STUDYNOTE,
    origin: new URL(request.url).origin,
  });
}
