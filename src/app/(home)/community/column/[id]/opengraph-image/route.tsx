import { OG_PRESETS, createOgImage } from '@/shared/lib/og';

export function GET(request: Request) {
  return createOgImage({
    preset: OG_PRESETS.COLUMN,
    origin: new URL(request.url).origin,
  });
}
