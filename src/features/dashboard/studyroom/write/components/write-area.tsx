import Image from 'next/image';

import { ColumnLayout } from '@/components/layout/column-layout';

import WriteForm from './write-form';

const WriteArea = () => {
  return (
    <ColumnLayout.Right className="desktop:max-w-[740px] border-line-line1 h-fit w-full rounded-xl border bg-white px-8 py-10">
      <div className="flex w-full justify-between">
        <span>
          <div className="text-key-color-primary font-semibold">
            수업노트 작성
          </div>
          <h1 className="mt-2 text-[32px] font-bold">
            어떤 수업을 <br /> 진행하셨나요?
          </h1>
        </span>
        <Image
          src="/dashboard/study-room-write-header.png"
          alt="header-image"
          width={71}
          height={151}
        />
      </div>
      <WriteForm />
    </ColumnLayout.Right>
  );
};
export default WriteArea;
