import Image from 'next/image';

const problemCards = [
  {
    src: '/home/landing-01.svg',
    alt: '캐릭터1',
    texts: ['대화와 자료가 뒤죽박죽...', '그래서 이번 숙제는 어딨더라?'],
  },
  {
    src: '/home/landing-02.svg',
    alt: '캐릭터2',
    texts: ['스터디 플래너, 쓰긴 해야 되는데', '매번 실패해요'],
  },
  {
    src: '/home/landing-03.svg',
    alt: '캐릭터3',
    texts: ['대화와 자료가 뒤죽박죽...', '그 피드백은 어딨더라?'],
  },
];

export function Session2() {
  return (
    <section className="flex w-full justify-center bg-[#1A1A1A] px-6 py-20 text-white">
      <div className="max-w-[1385px]">
        <div className="mx-auto flex flex-col-reverse justify-between gap-20">
          <div className="mt-[119px] space-y-2 tracking-[-0.05em]">
            <p className="text-2xl leading-9 font-normal">
              수업만 듣고 관리는 어려운 과외?
            </p>
            <p className="mt-[18px] text-5xl leading-9 font-bold tracking-[-0.05em]">
              이런 과외 이제 그만!
            </p>
          </div>
        </div>

        <div className="mx-auto mt-[58px] mr-[223px] mb-[138px] ml-[182px] flex flex-wrap justify-center gap-[100px]">
          {problemCards.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div className="flex h-[283px] w-[260px] items-center justify-center rounded-full bg-white">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={166}
                  height={173}
                />
              </div>
              <div className="mt-[21px] space-y-2 text-center text-lg leading-[22px] font-normal tracking-[-0.05em]">
                {item.texts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
