import { LoginResponse } from '@/features/auth/type';
import { BASE_URL } from '@/lib/api';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post(BASE_URL + '/auth/login', () => {
    return HttpResponse.json<LoginResponse>({ token: mockToken });
  }),
];

const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
