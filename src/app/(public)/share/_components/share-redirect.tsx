'use client';

import { useEffect } from 'react';

type ShareRedirectProps = {
  href: string;
};

export const ShareRedirect = ({ href }: ShareRedirectProps) => {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return null;
};
