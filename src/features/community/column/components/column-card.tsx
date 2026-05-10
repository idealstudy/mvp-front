import Image from 'next/image';
import Link from 'next/link';

import { ColumnListItem } from '@/entities/column';
import { PUBLIC } from '@/shared/constants';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Eye, Heart } from 'lucide-react';

export default function ColumnCard({ column }: { column: ColumnListItem }) {
  return (
    <Link
      href={PUBLIC.COMMUNITY.COLUMN.DETAIL(column.id)}
      className="border-gray-3 rounded-xl border-[1.5px] bg-white"
    >
      {/* 상단 영역 */}
      <div className="bg-orange-1 relative h-[150px] rounded-t-xl">
        {column.thumbnailUrl && (
          <Image
            src={column.thumbnailUrl}
            alt={column.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-t-xl object-cover"
          />
        )}
        <div className="bg-gray-12/40 absolute top-4 right-4 flex gap-2 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-1">
            <Eye
              width={16}
              color="var(--color-gray-white)"
              aria-label="조회수"
            />
            <span className="font-label-normal text-gray-white">
              {column.viewCount}
            </span>
          </div>

          {column.likeCount > 0 && (
            <div className="flex items-center gap-1">
              <Heart
                width={16}
                color="var(--color-gray-white)"
                aria-label="좋아요"
              />
              <span className="font-label-normal text-gray-white">
                {column.likeCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="border-gray-3 rounded-b-xl border-t-1 bg-white px-6 py-4">
        <p className="font-body1-heading mb-2 truncate">{column.title}</p>
        <span>
          {column.authorName ?? column.authorNickname ?? '알 수 없음'}
        </span>
        <div className="flex items-center justify-between gap-2">
          <div className="text-gray-7 font-caption-heading flex flex-1 gap-1 truncate">
            {column.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <span className="text-gray-5">
            {formatDistanceToNow(new Date(column.regDate), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
