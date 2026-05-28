'use client';

import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const updateMatches = () => {
      setMatches(mediaQueryList.matches);
    };

    updateMatches();
    mediaQueryList.addEventListener('change', updateMatches);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
};
