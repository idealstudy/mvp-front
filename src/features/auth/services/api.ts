import { LoginResponse } from '@/features/auth/type';
import { api } from '@/lib/api';
import { LoginFormValues } from '@/schema/login';

export const login = async (params: LoginFormValues) => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/auth/login',
    params
  );
  return response;
};

export const logout = async () => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/auth/logout'
  );
  return response;
};

export const testError = async () => {
  const response = await api.post<LoginResponse>(
    'http://13.125.112.205:8080/api/users/asdfjkasfdlkafsdjl'
  );
  return response;
};
