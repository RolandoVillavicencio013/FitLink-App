jest.mock('../../../src/containers/RegisterContainer', () => ({
  useRegisterContainer: jest.fn(),
}));

jest.mock('../../../src/components/forms/RegisterForm', () => ({
  RegisterForm: jest.fn(() => null),
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
import { RegisterView } from '../../../src/components/views/RegisterView';
import { useRegisterContainer } from '../../../src/containers/RegisterContainer';
import { RegisterForm } from '../../../src/components/forms/RegisterForm';

describe('RegisterView', () => {
  const mockUseRegisterContainer = useRegisterContainer as jest.Mock;

  const mockContainerData = {
    formData: {
      fullName: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
    },
    errors: {
      fullName: '',
      email: '',
      username: '',
      password: '',
    },
    loading: false,
    updateField: jest.fn(),
    handleRegister: jest.fn(),
    navigateToLogin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegisterContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<RegisterView />)).not.toThrow();
  });

  it('should call useRegisterContainer hook', () => {
    render(<RegisterView />);
    expect(useRegisterContainer).toHaveBeenCalled();
  });

  it('should render RegisterForm', () => {
    render(<RegisterView />);
    expect(RegisterForm).toHaveBeenCalled();
  });

  it('should pass fullName from formData to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.fullName).toBe('John Doe');
  });

  it('should pass email from formData to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.email).toBe('john@example.com');
  });

  it('should pass username from formData to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.username).toBe('johndoe');
  });

  it('should pass password from formData to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.password).toBe('password123');
  });

  it('should pass fullName error to RegisterForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { fullName: 'Name required', email: '', username: '', password: '' },
    };
    mockUseRegisterContainer.mockReturnValue(dataWithError);
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.fullNameError).toBe('Name required');
  });

  it('should pass email error to RegisterForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { fullName: '', email: 'Invalid email', username: '', password: '' },
    };
    mockUseRegisterContainer.mockReturnValue(dataWithError);
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.emailError).toBe('Invalid email');
  });

  it('should pass username error to RegisterForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { fullName: '', email: '', username: 'Username taken', password: '' },
    };
    mockUseRegisterContainer.mockReturnValue(dataWithError);
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.usernameError).toBe('Username taken');
  });

  it('should pass password error to RegisterForm', () => {
    const dataWithError = {
      ...mockContainerData,
      errors: { fullName: '', email: '', username: '', password: 'Password weak' },
    };
    mockUseRegisterContainer.mockReturnValue(dataWithError);
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.passwordError).toBe('Password weak');
  });

  it('should pass loading state to RegisterForm', () => {
    const loadingData = { ...mockContainerData, loading: true };
    mockUseRegisterContainer.mockReturnValue(loadingData);
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(true);
  });

  it('should pass handleRegister to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.onRegister).toBe(mockContainerData.handleRegister);
  });

  it('should pass navigateToLogin to RegisterForm', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.onNavigateToLogin).toBe(mockContainerData.navigateToLogin);
  });

  it('should call updateField with fullName when onFullNameChange is called', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    callArgs.onFullNameChange('Jane Doe');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('fullName', 'Jane Doe');
  });

  it('should call updateField with email when onEmailChange is called', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    callArgs.onEmailChange('jane@example.com');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('email', 'jane@example.com');
  });

  it('should call updateField with username when onUsernameChange is called', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    callArgs.onUsernameChange('janedoe');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('username', 'janedoe');
  });

  it('should call updateField with password when onPasswordChange is called', () => {
    render(<RegisterView />);
    const callArgs = (RegisterForm as jest.Mock).mock.calls[0][0];
    callArgs.onPasswordChange('newpassword');
    expect(mockContainerData.updateField).toHaveBeenCalledWith('password', 'newpassword');
  });
});
