import Image from 'next/image';
import Link from 'next/link';

import { ROUTE } from '@/constants/route';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#2E2E2E] px-5 py-[68px] text-sm text-white">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link href={ROUTE.HOME}>
          <Image
            src="/logo.svg"
            alt="THE EDU 로고"
            width={79}
            height={22}
            className="cursor-pointer"
          />
        </Link>

        <p className="mt-[31px]">
          <span className="font-semibold">팀 디에듀</span> | 조성진 강이규
          김나래 김다혜 김대민 김효인 나경주 백인빈 신상호 오황석 장우성
        </p>

        <p>
          <span className="font-semibold">이메일</span> |{' '}
          <a href="mailto:support@dedu.kr">support@dedu.kr</a>
        </p>
      </div>
    </footer>
  );
};
