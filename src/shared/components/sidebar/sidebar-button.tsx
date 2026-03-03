'use client';

import React from 'react';

import Image from 'next/image';

import { Button } from '@/shared/components/ui/button';

interface SidebarButtonProps {
  onClick: () => void;
  imgUrl?: string;
  btnName: string;
  disabled?: boolean;
}

export const SidebarButton = ({
  onClick,
  imgUrl,
  btnName,
  disabled = false,
}: SidebarButtonProps) => {
  return (
    <Button
      className="border-gray-11 bg-orange-7 hover:bg-orange-8 font-body2-heading rounded-xl text-white"
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
    >
      {imgUrl && (
        <Image
          src={`${imgUrl}`}
          alt="search"
          width={24}
          height={24}
          className="mr-2"
        />
      )}

      <span>{btnName}</span>
    </Button>
  );
};
