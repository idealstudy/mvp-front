import Image from 'next/image';

type OgCardProps = {
  title: string;
  label: string;
  imageSrc: string;
  logoSrc: string;
  backgroundColor: string;
  bottomBarColor: string;
};

export const OgCard = ({
  title,
  label,
  imageSrc,
  logoSrc,
  backgroundColor,
  bottomBarColor,
}: OgCardProps) => {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        position: 'relative',
        backgroundColor,
        fontFamily: 'Pretendard',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '65px',
          backgroundColor: bottomBarColor,
        }}
      />

      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#5F5A54',
              lineHeight: 1.2,
            }}
          >
            {label}
          </div>

          <Image
            src={logoSrc}
            alt="D'edu"
            style={{
              width: '99px',
              height: '27px',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            marginTop: '28px',
            width: '540px',
            height: '240px',
            fontSize: 54,
            fontWeight: 800,
            color: '#333333',
            lineHeight: '74px',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>

        <Image
          src={imageSrc}
          alt=""
          style={{
            position: 'absolute',
            right: '34px',
            bottom: '34px',
            width: '220px',
            height: '220px',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};
