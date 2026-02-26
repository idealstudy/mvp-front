'use client';

import React from 'react';

import { Button } from '@/shared/components/ui/button';

export const AskTeacherButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      className="border-key-color-primary text-key-color-primary hover:bg-key-color-secondary/20 gap-2 rounded-xl font-semibold"
      variant="outlined"
      onClick={onClick}
    >
      <span>수업 문의하기</span>
    </Button>
  );
};
