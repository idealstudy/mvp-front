import { ImageResponse } from 'next/og';

import { readFileSync } from 'fs';
import { join } from 'path';

import { OgCard } from './og-card';
import type { OgTheme } from './og-config';

type CreateOgImageParams = {
  title: string;
  theme: OgTheme;
};

const truncateOgTitle = (title: string, maxLength = 28) => {
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength)}...`;
};

export const createOgImage = ({ title, theme }: CreateOgImageParams) => {
  const imageSrc = getPublicImageDataUrl(theme.image);
  const logoSrc = getPublicImageDataUrl('/og/og-logo.png');

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

const getPublicImageDataUrl = (src: string) => {
  const filePath = join(process.cwd(), 'public', src.replace(/^\//, ''));
  const file = readFileSync(filePath);
  const base64 = file.toString('base64');

  return `data:image/png;base64,${base64}`;
};
