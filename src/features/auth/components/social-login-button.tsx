'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { env, serverEnv } from '@/shared/constants/api';
import { trackAuthKakaoLoginClick } from '@/shared/lib/gtm/trackers';

export default function SocialLoginButton() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const inviteToken = searchParams.get('token');

  const [kakaoAuthUrl, setKakaoAuthUrl] = useState('');

  useEffect(() => {
    const state = inviteToken
      ? `&state=${encodeURIComponent(`inviteToken:${inviteToken}`)}`
      : '';

    setKakaoAuthUrl(
      `https://kauth.kakao.com/oauth/authorize?client_id=${env.kakaoClientId}&redirect_uri=${serverEnv.backendApiUrl}/auth/kakao/callback&response_type=code${state}`
    );
  }, [inviteToken]);

  return (
    <div className="my-4 block items-center">
      {error === 'kakao_failed' && (
        <div className="text-system-warning mb-4">
          카카오 로그인에 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      <a
        href={kakaoAuthUrl}
        onClick={trackAuthKakaoLoginClick}
        aria-label="카카오로 로그인"
        className="block h-14 rounded-xl bg-[#FEE500] bg-[url('/auth/kakao_login_large_narrow.png')] bg-contain bg-center bg-no-repeat"
      ></a>
    </div>
  );
}
