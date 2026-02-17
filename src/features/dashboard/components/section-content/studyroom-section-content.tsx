import { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { STUDYROOM_SECTION_CONSTANTS } from './constants';
import { StudyroomImageButton } from './studyroom-image-button';

type StudyroomSectionContentProps = {
  studyRooms: {
    id: number;
    name: string;
  }[];
  onStudyRoomClick: (studyRoomId: number) => void;
};

const StudyroomSectionContent = ({
  studyRooms,
  onStudyRoomClick,
}: StudyroomSectionContentProps) => {
  const {
    IMAGE_SIZE_MOBILE,
    IMAGE_SIZE_TABLET,
    IMAGE_GAP,
    BUTTON_WIDTH,
    TITLE_ROW_GAP,
    ANIMATION_DURATION,
    TABLET_BREAKPOINT,
  } = STUDYROOM_SECTION_CONSTANTS;
  const [isTablet, setIsTablet] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(
    -(IMAGE_SIZE_MOBILE + IMAGE_GAP)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const totalCount = studyRooms.length;
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // 이미지 크기, 슬라이드 거리, 타이틀 뷰포트 너비 계산
  const imageSize = isTablet ? IMAGE_SIZE_TABLET : IMAGE_SIZE_MOBILE;
  const slideStep = imageSize + IMAGE_GAP;
  const titleViewportWidth = imageSize - BUTTON_WIDTH * 2 - TITLE_ROW_GAP * 2;
  const titleSlideStep = titleViewportWidth + IMAGE_GAP;
  const titleTranslateX = translateX * (titleSlideStep / slideStep);

  // 화면 크기 변경 시 타블렛 크기 여부 업데이트
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    const handler = () => setIsTablet(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [TABLET_BREAKPOINT]);

  // 애니메이션
  useEffect(() => {
    if (!isAnimating) setTranslateX(-slideStep);
  }, [slideStep, isAnimating]);

  // 언마운트 시 setTimeout 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const prevIndex =
    totalCount > 0 ? (currentIndex - 1 + totalCount) % totalCount : 0;
  const nextIndex = totalCount > 0 ? (currentIndex + 1) % totalCount : 0;

  // 스터디룸 이동
  const moveTo = useCallback(
    (direction: 'prev' | 'next') => {
      if (isAnimating || totalCount <= 1) return;

      setIsAnimating(true);
      setTranslateX(direction === 'prev' ? 0 : -slideStep * 2);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        animationTimeoutRef.current = null;
        setCurrentIndex((prev) => {
          if (direction === 'prev') {
            return prev === 0 ? totalCount - 1 : prev - 1;
          } else {
            return prev === totalCount - 1 ? 0 : prev + 1;
          }
        });
        setTranslateX(-slideStep);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    },
    [isAnimating, totalCount, slideStep, ANIMATION_DURATION]
  );

  const handleStudyRoomImageClick = () =>
    onStudyRoomClick(studyRooms[currentIndex]?.id ?? 0);

  if (totalCount === 0)
    return (
      <p className="font-body2-normal text-orange-7">
        상단을 참고해 스터디룸을 생성해주세요.
      </p>
    );

  const studyRoomTitleClassName =
    'font-headline2-heading text-gray-12 min-w-0 shrink-0 truncate text-center leading-6 tablet:font-headline1-heading text-balance';

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        className="relative flex w-full items-center justify-center select-none"
        aria-label="스터디룸 목록"
      >
        {/* 스터디룸 이미지 */}
        <div className="tablet:h-[300px] tablet:w-[300px] h-[200px] w-[200px] shrink-0 overflow-hidden">
          <div
            className="flex flex-nowrap items-center"
            style={{
              width: slideStep * 3 - IMAGE_GAP,
              gap: IMAGE_GAP,
              transform: `translateX(${translateX}px)`,
              transition: isAnimating
                ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : 'none',
            }}
          >
            <StudyroomImageButton
              alt={studyRooms[prevIndex]?.name ?? '이전 스터디룸'}
              onClick={handleStudyRoomImageClick}
              aria-hidden="true"
            />
            <StudyroomImageButton
              alt={studyRooms[currentIndex]?.name ?? '스터디룸'}
              onClick={handleStudyRoomImageClick}
            />
            <StudyroomImageButton
              alt={studyRooms[nextIndex]?.name ?? '다음 스터디룸'}
              onClick={handleStudyRoomImageClick}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* 스터디룸 타이틀 */}
      <div className="tablet:w-[300px] mx-auto flex h-6 w-[200px] items-center gap-2 select-none">
        <button
          type="button"
          className="flex h-6 w-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent px-1"
          onClick={(e) => {
            e.stopPropagation();
            moveTo('prev');
          }}
          aria-label="이전 스터디룸"
          disabled={totalCount <= 1}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          className="h-6 min-w-0 flex-1 cursor-pointer overflow-hidden"
          onClick={() => onStudyRoomClick(studyRooms[currentIndex]?.id ?? 0)}
          aria-label={`${studyRooms[currentIndex]?.name ?? '스터디룸'} 스터디룸으로 이동`}
        >
          <div
            className="flex flex-nowrap items-center"
            style={{
              width: titleSlideStep * 3 - IMAGE_GAP,
              gap: IMAGE_GAP,
              transform: `translateX(${titleTranslateX}px)`,
              transition: isAnimating
                ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : 'none',
            }}
          >
            <div
              className={studyRoomTitleClassName}
              style={{ width: titleViewportWidth, height: 24 }}
            >
              {studyRooms[prevIndex]?.name}
            </div>
            <div
              className={studyRoomTitleClassName}
              style={{ width: titleViewportWidth, height: 24 }}
            >
              {studyRooms[currentIndex]?.name}
            </div>
            <div
              className={studyRoomTitleClassName}
              style={{ width: titleViewportWidth, height: 24 }}
            >
              {studyRooms[nextIndex]?.name}
            </div>
          </div>
        </button>

        <button
          type="button"
          className="flex h-6 w-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent px-1"
          onClick={(e) => {
            e.stopPropagation();
            moveTo('next');
          }}
          aria-label="다음 스터디룸"
          disabled={totalCount <= 1}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default StudyroomSectionContent;
