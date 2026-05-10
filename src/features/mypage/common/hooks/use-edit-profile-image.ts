import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';

import { getCroppedImage } from '@/shared/components/image-crop';
import { DEFAULT_PROFILE_IMAGE, getProfileImageSrc } from '@/shared/constants';

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface UseEditProfileImageParams {
  serverImageUrl?: string;
}

interface UseEditProfileImageResult {
  crop: { x: number; y: number };
  croppedAreaPixels: CroppedAreaPixels | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageCropper: () => void;
  handleOpenFilePicker: () => void;
  handleProfileImageChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  imageUrl: string;
  imageFile: File | null;
  isCropperClicked: boolean;
  openModal: boolean;
  profileImageUrl: string;
  selectedImageId: number | null;
  setCrop: (crop: { x: number; y: number }) => void;
  setCroppedAreaPixels: (croppedAreaPixels: CroppedAreaPixels | null) => void;
  setImageUrl: (imageUrl: string) => void;
  setIsCropperClicked: (isCropperClicked: boolean) => void;
  setOpenModal: (openModal: boolean) => void;
  setSelectedImageId: (selectedImageId: number | null) => void;
  setZoom: (zoom: number) => void;
  clearSelectedImage: () => void;
  onApply: () => Promise<void>;
  zoom: number;
}

const INITIAL_CROP = { x: 0, y: 0 };
const INITIAL_ZOOM = 1;

export function useEditProfileImage({
  serverImageUrl,
}: UseEditProfileImageParams): UseEditProfileImageResult {
  const [openModal, setOpenModal] = useState(false);
  const [imageUrl, setImageUrlState] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isCropperClicked, setIsCropperClicked] = useState(false);
  const [crop, setCrop] = useState(INITIAL_CROP);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = (): void => {
    if (!objectUrlRef.current) return;

    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const setImageUrl = (nextImageUrl: string): void => {
    revokeObjectUrl();

    if (nextImageUrl.startsWith('blob:')) {
      objectUrlRef.current = nextImageUrl;
    }

    setImageUrlState(nextImageUrl);
  };

  const clearSelectedImage = (): void => {
    setSelectedImageId(null);
    setImageUrlState('');
    setImageFile(null);
    revokeObjectUrl();
  };

  const resetCropState = (): void => {
    setCrop(INITIAL_CROP);
    setZoom(INITIAL_ZOOM);
    setCroppedAreaPixels(null);
  };

  const handleOpenFilePicker = (): void => {
    fileInputRef.current?.click();
  };

  const handleImageCropper = (): void => {
    setOpenModal(false);
    setIsCropperClicked(true);
  };

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearSelectedImage();
    resetCropState();

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    handleImageCropper();
    event.target.value = '';
  };

  const onApply = async (): Promise<void> => {
    if (!imageUrl || !croppedAreaPixels) {
      setIsCropperClicked(false);
      return;
    }

    const croppedBlob = await getCroppedImage(imageUrl, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], 'profile-image.jpg', {
      type: croppedBlob.type || 'image/jpeg',
    });
    const previewUrl = URL.createObjectURL(croppedBlob);

    setImageFile(croppedFile);
    setImageUrl(previewUrl);
    setIsCropperClicked(false);
    setOpenModal(false);
    setSelectedImageId(null);
  };

  useEffect(() => revokeObjectUrl, []);

  return {
    crop,
    croppedAreaPixels,
    fileInputRef,
    handleImageCropper,
    handleOpenFilePicker,
    handleProfileImageChange,
    imageUrl,
    imageFile,
    isCropperClicked,
    openModal,
    profileImageUrl: getProfileImageSrc(
      imageUrl || serverImageUrl,
      DEFAULT_PROFILE_IMAGE.COMMON
    ),
    selectedImageId,
    setCrop,
    setCroppedAreaPixels,
    setImageUrl,
    setIsCropperClicked,
    setOpenModal,
    setSelectedImageId,
    setZoom,
    clearSelectedImage,
    onApply,
    zoom,
  };
}
