'use client';

import Image from 'next/image';
import Link from 'next/link';

import landing from '@/../public/img_landing_main.svg';
import { ROUTE } from '@/constants/route';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'bg-[#ff4500] text-lg font-bold text-white px-6 py-3 border border-[#1A1A1A]  hover:bg-[#e64500] hover:cursor-pointer',
      biz: 'bg-white text-lg font-normal text-[#1A1A1A] font-bold px-6 py-3 border border-[#CFCFCF] hover:bg-gray-100 hover:cursor-pointer',
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

export default function Session1() {
  return (
    <section className="mt-[136px] mb-[220px] max-w-[1385px]">
      <div className="flex-co flex gap-10 md:flex-row">
        <div className="mx-auto max-w-5xl">
          <p className="text-[2.5rem] leading-[1.6em] font-normal tracking-[-0.05em]">
            수업 · 숙제 · 피드백까지 <br /> 학습의 흐름을 깔끔하게,
            <span className="ml-[12px] font-bold">디에듀</span>
          </p>

          <div className="mt-[36px]">
            <p className="space-y-2 text-2xl leading-[1.6em] font-normal">
              공부는 혼자 해도, <br />
              혼자 다 감당하라는 말은 아니니까.
            </p>
          </div>

          <div className="mt-[282px] flex gap-3">
            <Link href={ROUTE.LOGIN}>
              <button
                className={cn(
                  buttonVariants({ variant: 'default', size: 'default' }),
                  'text-white'
                )}
              >
                디에듀 시작하기
              </button>
            </Link>

            <Link href={ROUTE.BIZ}>
              <button
                className={buttonVariants({ variant: 'biz', size: 'biz' })}
              >
                비즈니스 문의
              </button>
            </Link>
          </div>
        </div>

        <div>
          <Image
            src={landing}
            alt="Session 1 이미지"
            width={785}
            height={608}
          />
        </div>
      </div>
    </section>
  );
}
