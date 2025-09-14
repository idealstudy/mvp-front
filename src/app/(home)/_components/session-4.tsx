'use client';

import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

export function Session4() {
  return (
    <section className="mt-18 mr-[36px] mb-[162px] w-full max-w-[1344px]">
      <div className="mx-auto flex-col-reverse items-center justify-between">
        <div className="flex">
          <Image
            src="/home/landing-subtitle-03.svg"
            alt="sub title 그림"
            width={48}
            height={56}
          />

          <p className="mt-[18px] ml-[26px] text-5xl leading-9 font-bold tracking-[-0.05em]">
            자주 묻는 질문
          </p>
        </div>
      </div>

      <div className="mt-[45px] flex items-center justify-center">
        <FAQAccordion />
      </div>
    </section>
  );
}

const FAQAccordion = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const tabs = [
    {
      question: '디에듀서비스는 어떻게 사용할 수 있나요?',
      answer: [
        '디에듀에 접속하여 우상단의 시작하기 버튼을 눌러 회원 가입 및 로그인을 진행하실 수 있습니다.',
        '로그인 후 나타나는 대시보드 페이지에서 자신의 수업 및 숙제를 확인하고 스케줄을 관리할 수 있어요!',
      ],
    },
    { question: '디에듀서비스2', answer: '디에듀에 접속하시면' },
    { question: '디에듀서비스3', answer: '디에듀에 접속하시면' },
    { question: '디에듀서비스4', answer: '디에듀에 접속하시면' },
  ];

  return (
    <div className="w-full max-w-[1344px] cursor-auto bg-white">
      {/* 질문 목록 */}
      <div className="flex flex-col gap-2">
        {tabs.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer"
          >
            <button
              onClick={() => setActiveTab(activeTab === index ? null : index)}
              className={cn(
                'flex h-[88px] w-full cursor-pointer items-center justify-between border-[1px] px-10 py-8 transition-colors',
                'hover:bg-[rgb(255,69,0)] hover:text-[#1A1A1A]'
              )}
            >
              <p className="text-xl leading-9 font-bold tracking-[-0.05em]">
                {item.question}
              </p>
              <Image
                src="/ic-arrow-right.svg"
                alt="화살표"
                width={24}
                height={24}
                className={cn(
                  'inline-block transition-transform duration-300',
                  activeTab === index && 'rotate-90'
                )}
              />
            </button>

            {/* 답변 */}
            {activeTab === index && (
              <div className="border-x-[1px] border-t border-b-[1px] border-t-[#E0E0E0] px-10 py-8 text-[#1A1A1A]">
                <div className="text-base leading-[27px] font-normal tracking-[-0.05em]">
                  {Array.isArray(item.answer) ? (
                    item.answer.map((line, i) => <p key={i}>{line}</p>)
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
