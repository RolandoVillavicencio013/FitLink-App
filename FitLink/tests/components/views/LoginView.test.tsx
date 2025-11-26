jest.mock('../../../src/containers/LoginContainer', () => ({
  useLoginContainer: jest.fn(),
}));

jest.mock('../../../src/components/forms/LoginForm', () => ({
  LoginForm: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { LoginView } from '../../../src/components/views/LoginView';
import { useLoginContainer } from '../../../src/containers/LoginContainer';
import { LoginForm } from '../../../src/components/forms/LoginForm';

describe('LoginView', () => {
  const mockUseLoginContainer = useLoginContainer as jest.Mock;

  const mockContainerData = {
    formData: {
      email: 'test@example.com',
      password: 'password123',
    },
    errors: {
      email: '',
      password: '',
    },
    loading: false,
    updateField: jest.fn(),
    handleLogin: jest.fn(),
    navigateToRegister: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoginContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<LoginView />)).not.toThrow();
  });

  it('should call useLoginContainer hook', () => {
    render(<LoginView />);
    expect(useLoginContainer).toHaveBeenCalled();
  });

  it('should render LoginForm', () => {
    render(<LoginView />);
    expect(LoginForm).toHaveBeenCalled();
  });

  it('should pass email from formData to LoginForm', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.email).toBe('test@example.com');
  });

  it('should pass password from formData to LoginForm', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.password).toBe('password123');
  });

  it('should pass email error to LoginForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { email: 'Invalid email', password: '' },
    };
    mockUseLoginContainer.mockReturnValue(dataWithError);
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.emailError).toBe('Invalid email');
  });

  it('should pass password error to LoginForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { email: '', password: 'Password required' },
    };
    mockUseLoginContainer.mockReturnValue(dataWithError);
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.passwordError).toBe('Password required');
  });

  it('should pass loading state to LoginForm', () => {
    const loadingData = { ...mockContainerData, loading: true };
    mockUseLoginContainer.mockReturnValue(loadingData);
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(true);
  });

  it('should pass handleLogin to LoginForm', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.onLogin).toBe(mockContainerData.handleLogin);
  });

  it('should pass navigateToRegister to LoginForm', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.onNavigateToRegister).toBe(mockContainerData.navigateToRegister);
  });

  it('should call updateField with email when onEmailChange is called', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    callArgs.onEmailChange('new@email.com');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('email', 'new@email.com');
  });

  it('should call updateField with password when onPasswordChange is called', () => {
    render(<LoginView />);
    const callArgs = (LoginForm as jest.Mock).mock.calls[0][0];
    callArgs.onPasswordChange('newpassword');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('password', 'newpassword');
  });
});
