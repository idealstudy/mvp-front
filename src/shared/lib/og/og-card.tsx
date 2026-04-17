/* eslint-disable @next/next/no-img-element */
import { OG_ASSETS } from './og-config';

type OgCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  logoSrc?: string;
};

export const OgCard = ({
  title,
  imageSrc,
  imageAlt = '',
  logoSrc = OG_ASSETS.logo,
}: OgCardProps) => {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FCFBFA',
        fontFamily: 'Pretendard, Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          height: 94,
          backgroundColor: '#F6EFE8',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 64,
          display: 'flex',
        }}
      >
        <img
          src={logoSrc}
          alt="D'edu"
          width={125}
          height={34}
          style={{
            width: 125,
            height: 34,
            objectFit: 'contain',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 64,
          maxWidth: 680,
          display: 'flex',
          whiteSpace: 'pre-wrap',
          color: '#333333',
          fontSize: 78,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: 0,
        }}
      >
        {title}
      </div>

      <img
        src={imageSrc}
        alt={imageAlt}
        width={260}
        height={260}
        style={{
          position: 'absolute',
          right: 72,
          bottom: 58,
          width: 260,
          height: 260,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
