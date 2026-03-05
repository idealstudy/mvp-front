'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const ListGrid = ({ children }: Props) => {
  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-6">
      {children}
    </div>
  );
};
