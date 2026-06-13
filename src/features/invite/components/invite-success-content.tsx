import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { PRIVATE } from '@/shared/constants';

export const InviteSuccessContent = ({
  studyRoomId,
}: {
  studyRoomId: number;
}) => {
  return (
    <div
      data-testid="invite-success-content"
      className="flex flex-col items-center gap-3"
    >
      <Image
        src="/character/img_intro01.png"
        alt="스터디룸 참여 완료"
        width={300}
        height={300}
        className="tablet:w-75 tablet:h-75 h-40 w-40"
      />
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-body1-heading tablet:font-headline1-heading text-gray-12">
          스터디룸 참여가 완료됐어요!
        </h2>

        <Link
          href={PRIVATE.ROOM.DETAIL(studyRoomId)}
          className="tablet:mt-1 mt-3"
        >
          <Button
            data-testid="invite-success-go-to-room-button"
            variant="primary"
            className="h-[46px] rounded-sm px-8"
          >
            <span className="font-body2-heading">스터디룸 바로 가기</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
