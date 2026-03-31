import React from 'react';

interface PlusIconProps {
  size?: number;
  color?: string;
}

export const PlusIcon = ({ size = 16, color = '#7C7C7C' }: PlusIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 13.5L7.5 8L13 8M7.5 2.5L7.49948 8.00052L2 8"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
