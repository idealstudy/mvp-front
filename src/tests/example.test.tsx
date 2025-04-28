import LoginForm from '@/features/auth/components/login-form';
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { renderWithProviders } from './utils';

describe('LoginForm', () => {
  renderWithProviders(<LoginForm />);

  test('정상적으로 렌더링되어야 합니다.', () => {
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  });
});
