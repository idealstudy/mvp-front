'use client';

import Link from 'next/link';

import { MiniSpinner } from '@/shared/components/loading';
import { Button } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';

import { useAdminOpenChallengeDetailQuery } from '../hooks/use-admin-open-challenge';
import { AdminOpenChallengeForm } from './admin-open-challenge-form';

type AdminOpenChallengeEditClientProps = {
  id: string;
};

export const AdminOpenChallengeEditClient = ({
  id,
}: AdminOpenChallengeEditClientProps) => {
  const { data, isError, isLoading } = useAdminOpenChallengeDetailQuery(id);

  if (isLoading) return <MiniSpinner />;

  if (isError || !data) {
    return (
      <div className="border-line-line2 rounded-md border bg-white p-8 text-center">
        <p className="font-body1-heading text-text-main">
          문제 정보를 불러오지 못했습니다.
        </p>
        <Button
          asChild
          className="mt-4"
          variant="outlined"
          size="small"
        >
          <Link href={PRIVATE.ADMIN.OPEN_CHALLENGE.LIST}>목록으로</Link>
        </Button>
      </div>
    );
  }

  return <AdminOpenChallengeForm challenge={data} />;
};
