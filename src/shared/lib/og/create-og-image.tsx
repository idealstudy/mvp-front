import { ImageResponse } from 'next/og';

import { OgCard } from './og-card';
import { OG_ASSETS, OG_IMAGE_SIZE, type OgPreset } from './og-config';

type CreateOgImageOptions = {
  preset: OgPreset;
  origin: string;
};

export const createOgImage = ({ preset, origin }: CreateOgImageOptions) => {
  return new ImageResponse(
    (
      <OgCard
        title={preset.title}
        imageSrc={toAbsoluteUrl(preset.image, origin)}
        imageAlt={preset.imageAlt}
        logoSrc={toAbsoluteUrl(OG_ASSETS.logo, origin)}
      />
    ),
    {
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
    }
  );
};

const toAbsoluteUrl = (path: string, origin: string) => {
  return new URL(path, origin).toString();
};
