'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ROUTE } from '@/constants/route';
import { useSession } from '@/features/auth/hooks/use-session';

export const Header = () => {
  const { data: session } = useSession();

  const roleMetaMap = {
    ROLE_STUDENT: {
      label: '학생',
      className: 'border-white text-white',
    },
    ROLE_PARENT: {
      label: '보호자',
      className: 'border-orange-scale-orange-20 text-orange-scale-orange-20',
    },
    ROLE_TEACHER: {
      label: '선생님',
      className: 'border-key-color-primary text-key-color-primary',
    },
  } as const;

  const buttonBase =
    'cursor-pointer border border-[#1A1A1A] px-6 py-3 text-base font-bold text-white';

  return (
    <header className="h-header-height fixed top-0 right-0 left-0 z-10 flex items-center border-b border-gray-200 bg-[#1A1A1A] px-8">
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={ROUTE.HOME}>
            <Image
              src={'/logo.svg'}
              alt="THE EDU 로고"
              width={79}
              height={22}
              className="cursor-pointer"
            />
          </Link>
          <Image
            src={'/img_header_beta.svg'}
            alt="BETA"
            width={44}
            height={20}
          />
        </div>
        {session && (
          <div className="flex items-center">
            <Image
              src={'/img_header_bell.svg'}
              alt="알림 벨 아이콘"
              width={24}
              height={24}
              className="mr-8 cursor-pointer"
            />
            <Image
              src={'/img_header_profile.svg'}
              alt="프로필 사진"
              width={48}
              height={48}
              className="desktop:flex mr-4 hidden cursor-pointer rounded-full"
            />
            <p className="desktop:flex mr-2 hidden items-center gap-2 text-[14px] font-[600] text-white">
              {session.nickname}
            </p>
            <div className="desktop:flex hidden items-center gap-2 rounded-[40px] border px-2 py-[2px] text-[12px] font-[400px] text-[#ffffff]">
              {roleMetaMap[session.auth].label}
            </div>
            <Image
              src={'/ic_hamburger.svg'}
              alt="햄버거 메뉴 아이콘"
              width={24}
              height={24}
              className="desktop:hidden mr-4 flex cursor-pointer"
            />
          </div>
        )}
        {session === null && (
          <div className="flex gap-5">
            <Link
              href={ROUTE.LOGIN}
              className={buttonBase}
            >
              로그인
            </Link>
            <Link
              href={ROUTE.SIGNUP}
              className={`${buttonBase} bg-key-color-primary hover:bg-key-color-secondary`}
            >
              디에듀 시작하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
