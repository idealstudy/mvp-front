import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { InvitationInfoDTO } from '@/entities/study-room';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';

import { useAcceptInvitation } from '../hooks';

export const InviteLetter = ({
  onOpenLoginModal,
  onOpenExitModal,
  data,
  isLoading,
  token,
}: {
  onOpenLoginModal: () => void;
  onOpenExitModal: () => void;
  data: InvitationInfoDTO | undefined;
  isLoading: boolean;
  token: string;
}) => {
  const { member } = useAuth();
  const router = useRouter();
  const { acceptInvitation } = useAcceptInvitation();

  const handleAccept = () => {
    if (member) {
      // 참여하기 로직 추가 예정
      if (member.role === 'ROLE_STUDENT') {
        acceptInvitation(token ?? '');
      } else {
        router.push(PUBLIC.CORE.INVITE.ERROR('ROLE_NOT_MATCH'));
      }
    } else {
      onOpenLoginModal();
    }
  };

  if (isLoading) {
    return null;
  }

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
            <p
              data-testid="invite-teacher-name"
              className="font-label-heading tablet:font-body2-heading text-gray-12 w-full text-center"
            >
              From. {data?.teacherName}선생님
            </p>
            <p
              data-testid="invite-study-room-name"
              className="font-body2-heading tablet:font-headline2-heading text-gray-12 w-full text-center"
            >
              {data?.studyRoomName} 초대장
            </p>
          </div>
          <div className="tablet:gap-2 flex w-full flex-col gap-1">
            <p
              data-testid="invite-message"
              className="font-label-normal tablet:font-body2-heading text-gray-12 w-full text-center"
            >
              {data?.message.split('\n')[0]}
            </p>
            <p className="font-label-normal tablet:font-body2-heading text-gray-12 w-full text-center">
              {data?.message.split('\n')[1]}
            </p>
          </div>
          {/* tablet ~ desktop 버튼*/}
          <div className="tablet:flex mt-1 hidden w-full justify-center gap-2">
            <Button
              data-testid="invite-reject-button"
              variant="outlined"
              className="font-label-normal h-[35px] rounded-sm px-9"
              size="xsmall"
              onClick={onOpenExitModal}
            >
              거절하기
            </Button>
            <Button
              data-testid="invite-accept-button"
              variant="primary"
              className="font-label-normal h-[35px] rounded-sm px-9"
              size="xsmall"
              onClick={handleAccept}
            >
              참여하기
            </Button>
          </div>
        </div>
      </div>
      {/* mobile 버튼 */}
      <div className="bg-gray-white tablet:hidden fixed bottom-0 left-0 flex h-22 w-full gap-2 px-4.5 pt-2.5 pb-6">
        <Button
          data-testid="invite-reject-button"
          variant="outlined"
          className="font-body2-normal flex-1"
          onClick={onOpenExitModal}
        >
          거절하기
        </Button>
        <Button
          data-testid="invite-accept-button"
          variant="primary"
          className="font-body2-normal flex-1"
          onClick={handleAccept}
        >
          참여하기
        </Button>
      </div>
    </>
  );
};
