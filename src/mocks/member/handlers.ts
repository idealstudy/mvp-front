import { env } from '@/shared/constants/api';
import { HttpResponse, http } from 'msw';

const MOCK_MEMBER_PAYLOAD = {
  status: 1073741824,
  message: 'Successfully retrieved member information.',
  data: {
    id: 1004,
    email: 'gemini.test@the-edu.site',
    password: 'mocked_secure_password',
    name: '김디에듀',
    nickname: '국평오',
    phoneNumber: '010-1234-5678',
    birthDate: '1995-10-26',
    agreeServiceTerms: true,
    agreeMarketing: false,
    agreeAgeCheck: true,
    agreePrivacyTerms: true,
    isProfilePublic: true,
    role: 'ROLE_STUDENT',
    regDate: '2025-11-07T13:00:00.000Z',
    modDate: '2025-11-07T13:00:00.000Z',
    modNicknameDate: '2025-11-07T13:00:00.000Z',
    deletedAt: null,
    deleted: false,
  },
};

// TODO: 타입 추가해야함
export const memberHandlers = [
  http.get(env.backendApiUrl + '/member/info', ({ request }) => {
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader?.includes('session_id=mock-token-success')) {
      return HttpResponse.json(
        { MOCK_MEMBER_PAYLOAD },
        {
          status: 200,
        }
      );
    }
  }),
];
