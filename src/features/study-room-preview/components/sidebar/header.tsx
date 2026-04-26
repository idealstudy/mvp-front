import { BaseHeader } from '@/shared/components/sidebar';

type PublicStudyroomSidebarHeaderProps = {
  studyRoomName?: string;
  teacherName?: string;
  thumbnailUrl?: string | null;
  onThumbnailClick?: () => void;
};

export const StudyroomPreviewSidebarHeader = ({
  studyRoomName,
  teacherName,
  thumbnailUrl,
  onThumbnailClick,
}: PublicStudyroomSidebarHeaderProps) => {
  return (
    <BaseHeader
      studyRoomName={studyRoomName}
      teacherName={teacherName}
      thumbnailUrl={thumbnailUrl}
      onThumbnailClick={onThumbnailClick}
      teacherSuffix="선생님"
      fallbackStudyRoomName="스터디룸"
      titleClassName="tablet:font-headline1-heading desktop:font-title-heading truncate text-[20px] leading-tight font-bold"
      teacherClassName="text-gray-scale-gray-60 tablet:text-base text-sm"
      imageWrapperClassName="bg-orange-scale-orange-1 tablet:h-[300px] relative h-[200px] w-full overflow-hidden rounded-[12px]"
      wrapperClassName="flex flex-col gap-6"
    />
  );
};
