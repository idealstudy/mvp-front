'use client';

import { useState } from 'react';

import Image from 'next/image';

import subTitle02 from '@/../public/img_landing_subtitle_02.svg';

export default function Session3() {
  return (
    <section className="mt-[179px] w-full">
      <div className="mx-auto flex max-w-[1385px] flex-col-reverse items-center md:flex-row">
        <Image
          src={subTitle02}
          alt="서브 타이틀 그림"
          width={48}
          height={56}
          className="mt-[50px] mr-[26px]"
        />
        <div className="space-y-2 tracking-[-0.05em]">
          <p className="mb-5 text-2xl leading-9 font-normal">
            디에듀와 함께라면?
          </p>
          <div className="flex">
            <p className="text-5xl leading-9 font-bold tracking-[-0.05em]">
              일정, 자료, 커뮤니케이션을 한 곳에서
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[77px] mr-[36px] flex justify-center">
        <TabSection />
      </div>
      <div className="mx-auto mt-[117px] h-[1px] w-full max-w-[1344px] bg-gray-200" />
    </section>
  );
}

const TabSection = () => {
  type TabIndex = 0 | 1 | 2 | 3;

  const [activeTab, setActiveTab] = useState<TabIndex>(0);

  const tabs = [
    {
      label: '스터디 보드',
      content: <StudyBoardContent />,
    },
    {
      label: '실시간 수업',
      content: <LiveClassContent />,
    },
    {
      label: 'VOD 예습·복습',
      content: <VodContent />,
    },
    {
      label: '빠른 자료 찾기',
      content: <QuickMaterialsContent />,
    },
  ] as const;

  return (
    <div className="w-full max-w-[1344px] bg-white">
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index as TabIndex)}
            className={`cursor-pointer border-[2px] border-b-0 border-black px-4 py-2 text-sm font-semibold transition ${
              activeTab === index
                ? 'bg-[#FF4500] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex h-[650px] w-full max-w-[1344px] items-center justify-center border-[2px] bg-[#F4F1F1]">
        <div className="text-lg text-gray-500">{tabs[activeTab].content}</div>
      </div>
    </div>
  );
};

// 예시 콘텐츠 컴포넌트
const StudyBoardContent = () => {
  return <div>스터디 보드 관련 콘텐츠</div>;
};

const LiveClassContent = () => {
  return <div>라이브 관련 콘텐츠</div>;
};

const VodContent = () => {
  return <div>비디오 관련 콘텐츠</div>;
};

const QuickMaterialsContent = () => {
  return <div>빠른 자료 찾기 콘텐츠</div>;
};
