'use client';

import Image from 'next/image';

import { EmojiPicker } from '@/shared/components/emoji-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

import { CommentDropdown } from './comment-section-dropdown';

interface CommentAnswerCardHeaderProps {
  isOwner: boolean;
  authorName: string;
  roleLabel?: string;
  profileImageSrc: string;
  showReaction: boolean;
  selectedEmojis: Record<string, number>;
  isEmojiPickerOpen: boolean;
  selectedReaction: string | null;
  isEditing: boolean;
  isDeleted?: boolean;
  onEmojiPickerOpenChange: (open: boolean) => void;
  onEmojiSelect: (emoji: string) => void;
  onReactionClick: (emoji: string) => void;
  onEdit: () => void;
  onReply: () => void;
  setIsDialogOpen: (open: boolean) => void;
}

// 프로필, 이름, 역할 (카드의 상위 섹션들)
export const CommentAnswerCardHeader = ({
  isOwner,
  authorName,
  roleLabel,
  profileImageSrc,
  showReaction,
  selectedEmojis,
  isEmojiPickerOpen,
  selectedReaction,
  isEditing,
  isDeleted,
  onEmojiPickerOpenChange,
  onEmojiSelect,
  onReactionClick,
  onEdit,
  onReply,
  setIsDialogOpen,
}: CommentAnswerCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
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
          <p className="font-body2-normal text-gray-12">{authorName}</p>
          {roleLabel ? (
            <>
              <p className="text-gray-7">·</p>
              <p className="font-body2-normal text-gray-7">{roleLabel}</p>
            </>
          ) : null}
        </div>
      </div>
      {!isEditing && !isDeleted && (
        <div className="flex items-center gap-1.5">
          {showReaction
            ? Object.entries(selectedEmojis).map(([emoji, count]) => (
                <button
                  key={emoji}
                  type="button"
                  className="border-gray-5 text-gray-12 font-label-normal inline-flex h-7.5 min-w-12.5 items-center justify-center rounded-xl border bg-white px-2 py-1.5 text-center leading-none"
                  onClick={() => onReactionClick(emoji)}
                >
                  {`${emoji} ${count}`}
                </button>
              ))
            : null}

          <Popover
            open={isEmojiPickerOpen}
            onOpenChange={onEmojiPickerOpenChange}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hover:bg-gray-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm"
                aria-label="Open emoji picker"
              >
                <Image
                  src="/studynotes/emoji_pick.png"
                  alt="more-emoji"
                  height={24}
                  width={24}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className="w-fit min-w-0 rounded-3xl p-0"
            >
              <EmojiPicker
                onClose={() => onEmojiPickerOpenChange(false)}
                onSelect={onEmojiSelect}
                selectedEmoji={selectedReaction}
              />
            </PopoverContent>
          </Popover>

          <CommentDropdown
            isOwner={isOwner}
            onEdit={onEdit}
            onReply={onReply}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      )}
    </div>
  );
};
