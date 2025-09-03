import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  scrollThreshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  scrollThreshold = 50,
}: UseInfiniteScrollOptions) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !hasNextPage || isFetchingNextPage)
      return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, scrollThreshold]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return {
    scrollContainerRef,
    handleScroll,
  };
};
