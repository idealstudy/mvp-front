import Image from 'next/image';

import { TextViewer, parseEditorContent } from '@/shared/components/editor';
import { DEFAULT_PROFILE_IMAGE, getProfileImageSrc } from '@/shared/constants';
import { getRelativeTimeString } from '@/shared/lib/utils';

type Props = {
  content: string;
  authorName: string;
  profileImageUrl?: string | null;
  authorSuffix?: string;
  regDate: string;
};

export const TeacherHomeworkContent = ({
  content,
  authorName,
  profileImageUrl,
  authorSuffix,
  regDate,
}: Props) => {
  const parsedContent = parseEditorContent(content);

  return (
    <div className="border-line-line1 flex flex-col gap-5 rounded-xl border bg-white p-10">
      <div className="flex items-center gap-3">
        <Image
          src={getProfileImageSrc(
            profileImageUrl,
            DEFAULT_PROFILE_IMAGE.TEACHER
          )}
          width={40}
          height={40}
          alt={`${authorName} 프로필`}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-body2-heading">
          {authorSuffix ? `${authorName} ${authorSuffix}` : authorName}
        </span>
      </div>

      <TextViewer value={parsedContent} />

      <span className="self-end text-xs text-gray-500">
        {getRelativeTimeString(regDate)} 작성
      </span>
    </div>
  );
};
