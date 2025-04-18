'use client';

import Image from 'next/image';
import Link from 'next/link';

import landing from '@/../public/img_landing_main.svg';

export default function Session1() {
  return (
    <section className="mt-[136px] mb-[220px] max-w-[1385px]">
      <div className="flex-co flex gap-[40px] md:flex-row">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[2.5rem] leading-[64px] font-normal tracking-[-0.05em]">
            수업 · 숙제 · 피드백까지
          </h2>

          <p className="mt-2 text-[2.5rem] leading-[64px] font-normal tracking-[-0.05em]">
            학습의 흐름을 깔끔하게, <span className="font-bold">디에듀</span>
          </p>

          <div className="mt-[36px] space-y-2 text-[20px] leading-[36px] font-normal tracking-[-0.05em]">
            <p>공부는 혼자 해도,</p>
            <p>혼자 다 감당하라는 말은 아니니까.</p>
          </div>

          <div className="mt-[282px] flex gap-[12px]">
            <Link href="/signin">
              <button className="text-[18px]font-normal text-white">
                디에듀 시작하기
              </button>
            </Link>
            <Link href="/biz">
              <button className="text-[18px]font-normal text-white">
                비즈니스 문의하기
              </button>
            </Link>
          </div>
        </div>

        <div>
          <Image
            src={landing}
            alt="Session 1 이미지"
            width={892}
            height={598}
          />
        </div>
      </div>
    </section>
  );
}
