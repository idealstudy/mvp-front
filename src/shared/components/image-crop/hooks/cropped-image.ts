type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const createImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () =>
      reject(new Error('이미지를 불러오지 못했습니다.'))
    );
    image.src = src;
  });

export const getCroppedImage = async (
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputSize = 280
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('이미지 편집 컨텍스트를 생성하지 못했습니다.');
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, outputSize, outputSize);

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('잘린 이미지를 생성하지 못했습니다.'));
        return;
      }

      resolve(blob);
    }, 'image/jpeg');
  });
};
