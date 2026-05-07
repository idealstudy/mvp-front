'use client';

import Cropper from 'react-easy-crop';

import { Button, Dialog } from '@/shared/components/ui';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect?: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete?: (
    croppedArea: { x: number; y: number; width: number; height: number },
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ) => void;
  clearSelectedImage: () => void;
}

export const ImageCropper = ({
  isOpen,
  onOpenChange,
  onApply,
  image,
  crop,
  zoom,
  aspect = 1,
  onCropChange,
  onZoomChange,
  onCropComplete,
  clearSelectedImage,
}: ImageCropperProps) => {
  const handleClose = (): void => {
    onOpenChange(false);
    clearSelectedImage();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
          return;
        }

        onOpenChange(open);
      }}
    >
      <Dialog.Content className="h-[720px] w-[640px] max-w-[calc(100%-2rem)] overflow-hidden rounded-[28px] border-none p-0 shadow-2xl">
        <Dialog.Header className="border-gray-2 relative border-b px-6 pt-5 pb-4">
          <Dialog.Close
            aria-label="이미지 자르기 모달 닫기"
            className={cn(
              'absolute top-5 left-5 flex h-10 w-10 cursor-pointer items-center',
              'text-gray-10 justify-center rounded-full transition-colors duration-150',
              'hover:bg-gray-1 hover:text-gray-12'
            )}
            onClick={handleClose}
          >
            <X size={24} />
          </Dialog.Close>

          <Dialog.Title className="font-headline1-normal text-gray-12 text-center">
            이미지 자르기
          </Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="relative min-h-0 flex-1 bg-white">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape="round"
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </Dialog.Body>
        <Dialog.Footer className="border-gray-2 bg-gray-white justify-center gap-3 border-t px-6 py-4">
          <Button
            type="button"
            variant="outlined"
            className="flex w-1/3 items-center justify-center"
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex w-1/3 items-center justify-center"
            onClick={onApply}
          >
            적용
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
