import { OG_THEME, createOgImage } from '@/shared/lib/og';

export async function GET(request: Request) {
  return createOgImage({
    title: '과제',
    theme: OG_THEME.HOMEWORK,
    origin: new URL(request.url).origin,
  });
}
