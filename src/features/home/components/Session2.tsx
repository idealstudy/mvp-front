import Image from 'next/image';

import landing01 from '@/../public/img_landing_01.svg';
import landing02 from '@/../public/img_landing_02.svg';
import landing03 from '@/../public/img_landing_03.svg';

const data = [
  {
    src: landing01,
    alt: '캐릭터1',
    texts: ['대화와 자료가 뒤죽박죽...', '그래서 이번 숙제는 어딨더라?'],
  },
  {
    src: landing02,
    alt: '캐릭터2',
    texts: ['스터디 플래너, 쓰긴 해야 되는데', '매번 실패해요'],
  },
  {
    src: landing03,
    alt: '캐릭터3',
    texts: ['대화와 자료가 뒤죽박죽...', '그 피드백은 어딨더라?'],
  },
];

export default function Session2() {
  return (
    <section className="w-full bg-[#1A1A1A] px-6 py-[80px] text-white">
      <div className="mx-auto flex max-w-[1385px] flex-col-reverse items-center justify-between gap-[80px] md:flex-row">
        <div className="mt-[119px] space-y-2 tracking-[-0.05em]">
          <p className="text-[24px] leading-[36px] font-normal">
            수업만 듣고 관리는 어려운 과외?
          </p>
          <p className="mt-[18px] text-[48px] leading-[36px] font-bold tracking-[-0.05em]">
            이런 과외 이제 그만!
          </p>
        </div>
      </div>

      <div className="mx-auto mt-[58px] mr-[223px] mb-[138px] ml-[182px] flex flex-wrap justify-center gap-[100px]">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div className="flex h-[283px] w-[260px] items-center justify-center rounded-full bg-white">
              <Image
                src={item.src}
                alt={item.alt}
                width={180}
                height={180}
              />
            </div>
            <div className="mt-[21px] space-y-2 text-center text-[18px] leading-[22px] font-normal tracking-[-0.05em]">
              {item.texts.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
