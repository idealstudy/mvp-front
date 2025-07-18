import Image from 'next/image';

export default function AuthBanner() {
  return (
    <section className="relative h-[276px]">
      <svg
        viewBox="0 0 1920 319"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-full w-full"
      >
        <ellipse
          cx="959.5"
          cy="-253.5"
          rx="1324.5"
          ry="572.5"
          fill="#F5F5F5"
        />
      </svg>

      <div className="relative mx-auto flex h-full max-w-[570px] items-center justify-between">
        <h1 className="text-[32px] leading-[160%] font-normal tracking-[-0.04em]">
          깔끔한 공부 디에듀, <br />
          <strong>
            <span className="text-key-color-primary">시작</span>해볼까요?
          </strong>
        </h1>
        <Image
          alt="auth-main"
          src="/auth/auth-main.png"
          width={167}
          height={185}
          priority
          className="absolute top-[90px] right-0"
        />
      </div>
    </section>
  );
}
