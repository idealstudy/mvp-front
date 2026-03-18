'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

export function RoleRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    router.replace(token ? `/select-role?token=${token}` : '/select-role');
  }, [router, token]);

  return null;
}
