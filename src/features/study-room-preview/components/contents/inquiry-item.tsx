import Link from 'next/link';

import { PreviewInquiryItem } from '@/entities/study-room-preview';
import { StatusBadge } from '@/shared/components/ui';
import { PUBLIC } from '@/shared/constants';

export default function InquiryItem({ item }: { item: PreviewInquiryItem }) {
  const content = (
    <>
      <p>{item.masked ? '비공개 문의 글' : (item.title ?? '-')}</p>
      <div className="font-caption-normal text-gray-8 flex items-center gap-4">
        <span>{item.regDate.split('T')[0]} 작성</span>
        <span>
          {item.masked ? '***' : (item.inquirerName ?? '***')}{' '}
          {item.inquirerRole}
        </span>
        <StatusBadge
          variant={item.status === 'ANSWERED' ? 'success' : 'primary'}
          label={item.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
          className="font-caption-heading"
        />
      </div>
    </>
  );

  // 마스킹된 경우 일반 목록 (클릭 안됨)
  if (item.masked) {
    return (
      <li className="hover:bg-background-gray rounded-md p-3">{content}</li>
    );
  }

  // 마스킹되지 않은 경우, Link로 상세 조회 가능 (선생님, 작성자)
  return (
    <li className="hover:bg-background-gray rounded-md p-3">
      <Link href={PUBLIC.INQUIRY.DETAIL(item.id)}>{content}</Link>
    </li>
  );
}
