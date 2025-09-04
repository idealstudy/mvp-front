'use client';

import Link from 'next/link';

export const ListItem = ({
  title,
  subtitle,
  tag,
  id,
  href,
  icon,
  date,
  dropdown,
}: {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  id: number;
  href: string;
  tag?: React.ReactNode;
  date?: string;
  dropdown?: React.ReactNode;
}) => {
  return (
    <Link
      key={id}
      className="font-body2-normal hover:bg-gray-scale-gray-1 desktop:max-w-[740px] flex h-[66px] w-full flex-row items-center justify-between gap-4 bg-white px-4 py-3 hover:rounded-[12px]"
      href={href}
    >
      <div className="flex flex-row items-center gap-3">
        {icon}
        <div className="flex flex-col items-start justify-between">
          <div className="flex flex-row items-center gap-2">
            <p>{title}</p>
            {tag && tag}
          </div>
          <p className="font-caption-normal text-gray-scale-gray-60">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1">
        <p className="text-gray-scale-gray-70">{date}</p>
        <div
          className="flex shrink-0 flex-row items-center"
          onClick={(e) => e.preventDefault()}
        >
          {dropdown}
        </div>
      </div>
    </Link>
  );
};
