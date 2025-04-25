'use client';

import Image from 'next/image';
import Link from 'next/link';

import profile from '@/../public/header-profile.svg';
import logo from '@/../public/logo.svg';
import { ROUTE } from '@/constants/route';

export const Header = () => {
  // 로그인 여부 확인 수정 예정
  const isLoggedIn = false;

  const buttonBase =
    'cursor-pointer border border-[#1A1A1A] px-6 py-3 text-base font-bold text-white';

  return (
    <header className="border-b border-gray-200 bg-[#1A1A1A] px-4 py-3">
      <div className="mx-auto flex max-w-[1385px] items-center justify-between">
        <Link href={ROUTE.HOME}>
          <Image
            src={logo}
            alt="THE EDU 로고"
            width={79}
            height={22}
            className="cursor-pointer"
            role="button"
          />
        </Link>
        {isLoggedIn ? (
          <Image
            src={profile}
            alt="프로필 사진"
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="flex gap-5">
            <Link
              role="button"
              href={ROUTE.LOGIN}
              className={buttonBase}
            >
              로그인
            </Link>
            <Link
              role="button"
              href={ROUTE.SIGNUP.HOME}
              className={`${buttonBase} bg-[#ff4500] hover:bg-[#e64500]`}
            >
              디에듀 시작하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
