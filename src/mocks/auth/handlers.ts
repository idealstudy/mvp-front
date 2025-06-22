import {
  CheckEmailDuplicateBody,
  LoginResponse,
  VerifyCodeBody,
} from '@/features/auth/type';
import { BASE_URL } from '@/lib/api';
import { HttpResponse, http } from 'msw';

export const DUPLICATE_EMAIL = 'test@gmail.com';
export const VALID_VERIFICATION_CODE = '123456';

export const authHandlers = [
  http.post(BASE_URL + '/auth/login', () => {
    return HttpResponse.json<LoginResponse>({
      token: mockToken,
    });
  }),
  http.post<never, CheckEmailDuplicateBody>(
    BASE_URL + '/public/email-verifications/check-duplicate',
    async ({ request }) => {
      const body = await request.json();

      if (body.email === DUPLICATE_EMAIL) {
        return new HttpResponse(null, { status: 400 });
      }

      return HttpResponse.json();
    }
  ),
  http.patch<never, VerifyCodeBody>(
    BASE_URL + '/public/email-verifications',
    async ({ request }) => {
      const body = await request.json();

      if (body.code !== VALID_VERIFICATION_CODE) {
        return new HttpResponse(null, { status: 400 });
      }

      return HttpResponse.json();
    }
  ),
  http.post(BASE_URL + '/auth/sign-up', () => {
    return HttpResponse.json();
  }),
];

const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
