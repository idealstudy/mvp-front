'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ROUTE } from '@/constants/route';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva('flex items-center justify-center text-center', {
  variants: {
    variant: {
      default:
        'bg-[#ff4500] text-lg font-bold text-white px-6 py-3 border border-[#1A1A1A]  hover:bg-[#e64500] cursor-pointer',

      biz: 'bg-white text-lg font-normal text-[#1A1A1A] px-6 py-3 border border-[#CFCFCF] hover:bg-gray-100 cursor-pointer',
    },
    size: {
      default: 'w-[270px] h-[70px]',
      biz: 'w-[209px] h-[70px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export function Session1() {
  return (
    <section className="mt-[136px] mb-[220px] w-full max-w-[1385px]">
      <div className="flex-co flex gap-10">
        <div>
          <h1 className="justify-center text-[2.5rem] leading-[1.6em] font-normal tracking-[-0.05em]">
            수업 · 숙제 · 피드백까지 <br /> 학습의 흐름을 깔끔하게,
            <span className="ml-[12px] font-bold">디에듀</span>
          </h1>

          <div className="mt-[36px]">
            <p className="space-y-2 text-2xl leading-[1.6em] font-normal">
              공부는 혼자 해도, <br />
              혼자 다 감당하라는 말은 아니니까.
            </p>
          </div>

          <div className="mt-[282px] flex gap-3">
            <Link
              href={ROUTE.SIGNUP}
              className={cn(
                buttonVariants({ variant: 'default', size: 'default' }),
                'text-white'
              )}
            >
              디에듀 시작하기
            </Link>

            <Link
              href={ROUTE.BIZ}
              className={buttonVariants({ variant: 'biz', size: 'biz' })}
            >
              비즈니스 문의
            </Link>
          </div>
        </div>

        <div>
          <Image
            src="/home/landing-main.svg"
            alt="Session 1 이미지"
            width={785}
            height={608}
            priority
          />
        </div>
      </div>
    </section>
  );
}
