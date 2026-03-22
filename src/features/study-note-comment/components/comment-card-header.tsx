import Image from 'next/image';

interface CommentCardHeaderProps {
  profileImageSrc: string;
  authorName: string;
  roleLabel: string;
}

export const CommentCardHeader = ({
  profileImageSrc,
  authorName,
  roleLabel,
}: CommentCardHeaderProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="border-gray-12 h-9 w-9 shrink-0 overflow-hidden rounded-full border">
        <Image
          src={profileImageSrc}
          alt="프로필 이미지"
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1">
        <p className="font-body2-normal text-gray-12">
          {roleLabel === '선생님' ? '선생님' : authorName}
        </p>
        {roleLabel === '학생' && (
          <>
            <p className="text-gray-7">·</p>
            <p className="font-body2-normal text-gray-7">{roleLabel}</p>
          </>
        )}
      </div>
    </div>
  );
};
