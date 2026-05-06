'use client';

import Image from 'next/image';

import { Button, Dialog } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';
import { ImagePlus, X } from 'lucide-react';

import { illustrationItems } from '../constants/illustration-items';

interface ProfileChangeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleOpenFilePicker: () => void;
  setImageUrl: (src: string) => void;
  selectedImageId: number | null;
  setSelectedImageId: (id: number) => void;
  clearSelectedImage: () => void;
  handleImageCropper: () => void;
}

type ActionItemProps = {
  icon: React.ReactNode;
  label: string;
  withDivider?: boolean;
};

const ActionItem = ({ icon, label, withDivider = true }: ActionItemProps) => {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-3 px-5 py-4 text-left',
        'hover:bg-gray-1 cursor-pointer transition-colors duration-150',
        withDivider && 'border-gray-2 border-b'
      )}
    >
      <span className="text-gray-11 flex h-6 w-6 items-center justify-center">
        {icon}
      </span>
      <span className="font-body2-normal text-gray-11">{label}</span>
    </button>
  );
};

export const ProfileChangeModal = ({
  isOpen,
  onOpenChange,
  handleOpenFilePicker,
  setImageUrl,
  selectedImageId,
  setSelectedImageId,
  clearSelectedImage,
  handleImageCropper,
}: ProfileChangeModalProps) => {
  // 일러스트 캐러셀
  // const ITEMS_PER_VIEW = 3;

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleNext = () => {
  //   if (currentIndex + 1 > illustrationItems.length - ITEMS_PER_VIEW) {
  //     setCurrentIndex(0);
  //     return;
  //   }
  //   setCurrentIndex(currentIndex + 1);
  // };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className="w-[480px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[32px] border-none p-2 shadow-2xl">
        <Dialog.Header className="border-gray-2 relative border-b px-6 pt-5 pb-4">
          <Dialog.Close
            aria-label="프로필 사진 추가 모달 닫기"
            className={cn(
              'absolute top-5 left-5 flex h-10 w-10 cursor-pointer items-center',
              'text-gray-10 justify-center rounded-full transition-colors duration-150',
              'hover:bg-gray-1 hover:text-gray-12'
            )}
            onClick={clearSelectedImage}
          >
            <X size={24} />
          </Dialog.Close>

          <Dialog.Title className="font-headline1-normal text-gray-12 text-center">
            프로필 사진 추가
          </Dialog.Title>

          {/* <button
            type="button"
            aria-label="프로필 사진 더보기"
            className={cn(
              'absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center',
              'text-gray-10 justify-center rounded-full transition-colors duration-150',
              'hover:bg-gray-1 hover:text-gray-12'
            )}
          >
            <MoreVertical size={22} />
          </button> */}
        </Dialog.Header>
        <Dialog.Body className="bg-gray-white overflow-hidden">
          <section className="border-gray-2 border-b px-4 py-5">
            <div className="mb-4 flex items-center justify-between px-2">
              <h3 className="font-body2-heading text-gray-11">
                일러스트레이션 둘러보기
              </h3>
            </div>

            <div className="relative">
              <div
                className="flex gap-3 overflow-hidden px-2"
                // style={{ transform: `translateX(-${translateX}px)` }}
              >
                {illustrationItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const isSelected = selectedImageId === item.id;

                      if (isSelected) {
                        clearSelectedImage();
                        return;
                      }
                      setImageUrl(item.src);
                      setSelectedImageId(item.id);
                    }}
                    className={cn(
                      'relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-full',
                      'ring-gray-2 ring-1 transition-transform duration-150 hover:scale-[1.03]',
                      `hover:ring-black`,
                      selectedImageId === item.id
                        ? 'ring-2 ring-black'
                        : 'ring-gray-2 ring-1 hover:ring-black'
                    )}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* <button
                type="button"
                aria-label="다음 일러스트 보기"
                className={cn(
                  'absolute top-1/2 right-2 flex h-15 w-15 -translate-y-1/2 cursor-pointer',
                  'text-gray-10 items-center justify-center rounded-full bg-white shadow-xl',
                  'hover:text-gray-12 transition-transform duration-150 hover:scale-105'
                )}
                onClick={() => handleNext()}
              >
                <ChevronRight size={22} />
              </button> */}
            </div>
          </section>

          <div className="bg-gray-white hover:cursor-pointer">
            <div onClick={handleOpenFilePicker}>
              <ActionItem
                icon={<ImagePlus size={21} />}
                label="기기에서 업로드"
              />
            </div>
            {/* <div>
              <ActionItem
                icon={<Camera size={21} />}
                label="사진 촬영"
                withDivider={false}
              />
            </div> */}
          </div>
        </Dialog.Body>
        <Dialog.Footer className="mt-2 justify-center gap-3">
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              clearSelectedImage();
              onOpenChange(false);
            }}
            className="flex w-1/3 items-center justify-center"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex w-1/3 items-center justify-center"
            onClick={handleImageCropper}
            disabled={!selectedImageId}
          >
            확인
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
