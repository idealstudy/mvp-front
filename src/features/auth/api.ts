import { LoginFormValues } from '@/schema/login';

export const login = async (params: LoginFormValues) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('로그인 중 오류가 발생했습니다');
  }
};
