import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

const email = 'fabio@test.com';
const password = '1234567890';

describe('SignIn Page testing', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    const screen = render(<SignIn />);

    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: email },
    });

    fireEvent.change(passwordField, {
      target: { value: password },
    });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const screen = render(<SignIn />);

    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: 'not-valid-email' },
    });

    fireEvent.change(passwordField, {
      target: { value: password },
    });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const screen = render(<SignIn />);

    const emailField = screen.getByPlaceholderText('E-mail');
    const passwordField = screen.getByPlaceholderText('Senha');
    const loginBtn = screen.getByText('Entrar');

    fireEvent.change(emailField, {
      target: { value: email },
    });

    fireEvent.change(passwordField, {
      target: { value: password },
    });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
