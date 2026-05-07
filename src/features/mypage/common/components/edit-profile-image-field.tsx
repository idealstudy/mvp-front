import { ChangeEvent, RefObject } from 'react';

import Image from 'next/image';

import { MiniSpinner } from '@/shared/components/loading';
import { cn } from '@/shared/lib/utils';
import { Camera } from 'lucide-react';

interface EditProfileImageFieldProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  name: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onOpenModal: () => void;
  profileImageUrl: string;
}

export default function EditProfileImageField({
  fileInputRef,
  isUploading,
  name,
  onFileChange,
  onOpenModal,
  profileImageUrl,
}: EditProfileImageFieldProps) {
  return (
    <div className="relative mx-auto h-[280px] w-[280px]">
      <div className="h-full w-full overflow-hidden rounded-full">
        <Image
          src={profileImageUrl}
          width={280}
          height={280}
          alt={`${name}님의 프로필 이미지`}
          className="h-full w-full rounded-full border border-gray-400 object-cover"
        />
      </div>

      {isUploading && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full',
            'bg-black/35'
          )}
        >
          <MiniSpinner
            size={36}
            className="text-white"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onOpenModal}
        aria-label="프로필 사진 선택하기"
        className={cn(
          'peer absolute right-5 bottom-1 z-10 flex h-12 w-12 cursor-pointer',
          'items-center justify-center rounded-full border border-white bg-white',
          'text-gray-7 shadow-lg transition-transform duration-200',
          'hover:text-orange-7 hover:scale-105'
        )}
      >
        <Camera
          size={22}
          strokeWidth={2.2}
        />
      </button>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center',
          'rounded-full bg-black/0 text-white opacity-0 transition-all duration-200',
          'peer-hover:bg-black/35 peer-hover:opacity-100'
        )}
      >
        <span
          className={cn(
            'font-label-heading rounded-full bg-black/55 px-5 py-2',
            'text-white backdrop-blur-sm'
          )}
        >
          프로필사진 변경하기
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
