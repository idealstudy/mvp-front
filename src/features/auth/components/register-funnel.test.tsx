import mockRouter from 'next-router-mock';

import { ROUTE } from '@/constants/route';
import { DUPLICATE_EMAIL } from '@/mocks/auth/handlers';
import { renderWithProviders } from '@/tests/utils';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { RegisterFunnel } from './register-funnel';

const FORM_DATA = {
  EMAIL: 'valid@gmail.com',
  VERIFICATION_CODE: '123456',
  PASSWORD: 'validpassword1!',
  NAME: '김에듀',
};

describe('RegisterFunnel', () => {
  beforeEach(() => {
    renderWithProviders(<RegisterFunnel />);
  });

  afterEach(() => {
    cleanup();
  });

  test('정상적으로 렌더링되어야 합니다.', () => {
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
  });

  test('이미 사용 중인 이메일일 경우 에러 메시지가 표시되어야 합니다.', async () => {
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText('이메일');
    const nextButton = screen.getByRole('button', { name: '계속' });

    await user.type(emailInput, DUPLICATE_EMAIL);
    await user.click(nextButton);

    expect(screen.getByText('이미 사용중인 이메일입니다.')).toBeInTheDocument();
  });

  test('모든 단계를 진행한 후 회원가입이 정상적으로 완료되어야 합니다.', async () => {
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText('이메일');
    const emailFormNextButton = screen.getByRole('button', { name: '계속' });

    await user.type(emailInput, FORM_DATA.EMAIL);
    await user.click(emailFormNextButton);

    const verificationCodeInput = screen.getByLabelText('인증코드');
    const passwordInput = screen.getByLabelText('비밀번호');
    const confirmPasswordInput = screen.getByLabelText('비밀번호 확인');
    const agreeAllCheckbox = screen.getByRole('checkbox', {
      name: '전체 약관 동의',
    });
    const credentialFormNextButton = screen.getByRole('button', {
      name: '계속',
    });
    const verifyCodeButton = screen.getByRole('button', {
      name: '확인',
    });

    expect(credentialFormNextButton).toBeDisabled();

    await user.type(verificationCodeInput, FORM_DATA.VERIFICATION_CODE);
    await user.click(verifyCodeButton);
    await user.type(passwordInput, FORM_DATA.PASSWORD);
    await user.type(confirmPasswordInput, FORM_DATA.PASSWORD);
    await user.click(agreeAllCheckbox);

    expect(credentialFormNextButton).toBeEnabled();

    await user.click(credentialFormNextButton);

    const nameInput = screen.getByLabelText('이름');
    const signUpButton = screen.getByRole('button', { name: '가입 완료' });

    await user.type(nameInput, FORM_DATA.NAME);
    await user.click(signUpButton);

    expect(mockRouter).toMatchObject({
      pathname: ROUTE.HOME,
    });
  });
});
