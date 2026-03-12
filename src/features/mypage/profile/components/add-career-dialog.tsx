'use client';

import { useState } from 'react';

import CareerDialog from '@/features/mypage/profile/components/career-dialog';
import { Plus } from 'lucide-react';

export default function AddCareerDialog() {
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCareerDialogOpen(true)}
        aria-label="경력 추가"
        className="cursor-pointer"
      >
        <Plus />
      </button>

      {/* 경력 Dialog */}
      {isCareerDialogOpen && (
        <CareerDialog
          isOpen={isCareerDialogOpen}
          onOpenChange={setIsCareerDialogOpen}
        />
      )}
    </>
  );
}
