import Image from 'next/image';
import Link from 'next/link';

import { ErrorReason, isInviteLinkErrorReason } from '@/features/invite/types';
import { Button } from '@/shared/components/ui/button';

const reasonText: Record<ErrorReason, { title: string; description: string }> =
  {
    ROLE_NOT_MATCH: {
      title: '학생 계정으로만 참여할 수 있어요',
      description: '보호자 계정은 스터디룸 초대가 어려워요.',
    },
    ALREADY_PARTICIPATED: {
      title: '이미 참여 중인 스터디룸이에요',
      description: '',
    },
    STUDY_ROOM_CAPACITY_EXCEEDED: {
      title: '가득 찬 스터디룸이에요',
      description:
        '이미 스터디룸이 가득 찼어요.\n다른 스터디룸을 둘러보실 수 있어요.',
    },
    CLOSED: {
      title: '종료된 스터디룸입니다.',
      description:
        '이 스터디룸은 종료되었어요.\n다른 스터디룸을 둘러보실 수 있어요.',
    },
    EXPIRED_LINK: {
      title: '이 초대 링크는 만료되었습니다.',
      description: '초대 링크 활성화 여부를 확인해주세요.',
    },
    INVALID_LINK: {
      title: '유효하지 않은 링크입니다.',
      description: '',
    },
  };

export const InviteErrorContent = ({ reason }: { reason: ErrorReason }) => {
  const errorCardImageSrc = isInviteLinkErrorReason(reason)
    ? '/invite/img_connection_error.png'
    : '/invite/img_invite_fail.png';

  return (
    <div
      data-testid="invite-error-content"
      className="tablet:gap-0 flex h-fit flex-col items-center gap-3"
    >
      <Image
        src={errorCardImageSrc}
        alt="error-card"
        width={300}
        height={300}
        className="tablet:w-75 tablet:h-75 h-40 w-40"
      />
      <div className="flex flex-col items-center gap-3">
        <h2
          data-testid="invite-error-title"
          className="font-body1-heading tablet:font-headline1-heading text-gray-12"
        >
          {reasonText[reason].title}
        </h2>
        <p className="font-label-normal tablet:font-body1-normal text-gray-8 tablet:text-left text-center whitespace-pre-line">
          {reasonText[reason].description}
        </p>

        <Link
          href="/"
          className="tablet:mt-1 mt-3"
        >
          <Button
            data-testid="invite-error-go-home-button"
            variant="primary"
            className="h-[46px] rounded-sm px-8"
          >
            <span className="font-body2-heading">홈으로 이동하기</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
