import { ImageResponse } from 'next/og';

import { readFileSync } from 'fs';
import { join } from 'path';

import { OgCard } from './og-card';
import type { OgTheme } from './og-config';

type CreateOgImageParams = {
  title: string;
  theme: OgTheme;
  origin: string;
};

const truncateOgTitle = (title: string, maxLength = 28) => {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

export const createOgImage = ({
  title,
  theme,
  origin,
}: CreateOgImageParams) => {
  const imageSrc = getPublicImageSrc(theme.image, origin);
  const logoSrc = getPublicImageSrc('/og/og-logo.png', origin);

  return new ImageResponse(
    (
      <OgCard
        title={truncateOgTitle(title)}
        label={theme.label}
        imageSrc={imageSrc}
        logoSrc={logoSrc}
        backgroundColor={theme.backgroundColor}
        bottomBarColor={theme.bottomBarColor}
      />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};

const getPublicImageSrc = (src: string, origin: string) => {
  try {
    const filePath = join(process.cwd(), 'public', src.replace(/^\//, ''));
    const file = readFileSync(filePath);
    return `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    return new URL(src, origin).toString();
  }
};
