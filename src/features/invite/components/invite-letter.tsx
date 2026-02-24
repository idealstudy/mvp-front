import Image from 'next/image';

import { Button } from '@/shared/components/ui';

export const InviteLetter = ({
  teacherName,
  studyRoomName,
}: {
  teacherName: string;
  studyRoomName: string;
}) => {
  return (
    <>
      <div className="tablet:w-125 relative flex w-90 flex-col">
        <Image
          src="/invite/img_letter_mobile.png"
          alt="invite-letter"
          width={360}
          height={108}
          className="tablet:hidden w-full"
        />
        <Image
          src="/invite/img_letter_tablet.png"
          alt="invite-letter"
          width={500}
          height={600}
          className="tablet:block hidden w-full"
        />
        <div className="tablet:top-36 tablet:gap-7 absolute top-25 left-0 flex w-full flex-col gap-4">
          <div className="tablet:gap-4.5 flex w-full flex-col gap-3">
            <p className="font-label-heading tablet:font-body2-heading text-gray-12 w-full text-center">
              From. {teacherName}선생님
            </p>
            <p className="font-body2-heading tablet:font-headline2-heading text-gray-12 w-full text-center">
              {studyRoomName} 초대장
            </p>
          </div>
          <div className="tablet:gap-2 flex w-full flex-col gap-1">
            <p className="font-label-normal tablet:font-body2-heading text-gray-12 w-full text-center">
              스터디룸에 초대되었습니다.
            </p>
            <p className="font-label-normal tablet:font-body2-heading text-gray-12 w-full text-center">
              새로운 배움이 시작될 순간이에요.
            </p>
          </div>
          {/* tablet ~ desktop 버튼*/}
          <div className="tablet:flex mt-1 hidden w-full justify-center gap-2">
            <Button
              variant="outlined"
              className="font-label-normal h-[35px] rounded-sm px-9"
              size="xsmall"
            >
              거절하기
            </Button>
            <Button
              variant="primary"
              className="font-label-normal h-[35px] rounded-sm px-9"
              size="xsmall"
            >
              참여하기
            </Button>
          </div>
        </div>
      </div>
      {/* mobile 버튼 */}
      <div className="bg-gray-white tablet:hidden fixed bottom-0 left-0 flex h-22 w-full gap-2 px-4.5 pt-2.5 pb-6">
        <Button
          variant="outlined"
          className="font-body2-normal flex-1"
        >
          거절하기
        </Button>
        <Button
          variant="primary"
          className="font-body2-normal flex-1"
        >
          참여하기
        </Button>
      </div>
    </>
  );
};
