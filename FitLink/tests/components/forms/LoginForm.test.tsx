import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginForm } from '../../../src/components/forms/LoginForm';

describe('LoginForm', () => {
  const defaultProps = {
    email: '',
    password: '',
    loading: false,
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onLogin: jest.fn(),
    onNavigateToRegister: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render title', () => {
      // Arrange & Act
      const { getByText } = render(<LoginForm {...defaultProps} />);

      // Assert
      expect(getByText('Iniciar sesion')).toBeTruthy();
    });

    it('should render email input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    });

    it('should render password input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    });

    it('should render login button', () => {
      // Arrange & Act
      const { getByText } = render(<LoginForm {...defaultProps} />);

      // Assert
      expect(getByText('Ingresar')).toBeTruthy();
    });

    it('should render register navigation button', () => {
      // Arrange & Act
      const { getByText } = render(<LoginForm {...defaultProps} />);

      // Assert
      expect(getByText('Ir a registro')).toBeTruthy();
    });
  });

  describe('email input', () => {
    it('should display email value', () => {
      // Arrange
      const props = { ...defaultProps, email: 'test@example.com' };

      // Act
      const { getByDisplayValue } = render(<LoginForm {...props} />);

      // Assert
      expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('should call onEmailChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'new@example.com');

      // Assert
      expect(defaultProps.onEmailChange).toHaveBeenCalledWith('new@example.com');
    });

    it('should display email error', () => {
      // Arrange
      const props = { ...defaultProps, emailError: 'Email inválido' };

      // Act
      const { getByText } = render(<LoginForm {...props} />);

      // Assert
      expect(getByText('Email inválido')).toBeTruthy();
    });
  });

  describe('password input', () => {
    it('should display password value', () => {
      // Arrange
      const props = { ...defaultProps, password: 'mypassword' };

      // Act
      const { getByDisplayValue } = render(<LoginForm {...props} />);

      // Assert
      expect(getByDisplayValue('mypassword')).toBeTruthy();
    });

    it('should call onPasswordChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'newpassword');

      // Assert
      expect(defaultProps.onPasswordChange).toHaveBeenCalledWith('newpassword');
    });

    it('should display password error', () => {
      // Arrange
      const props = { ...defaultProps, passwordError: 'Contraseña requerida' };

      // Act
      const { getByText } = render(<LoginForm {...props} />);

      // Assert
      expect(getByText('Contraseña requerida')).toBeTruthy();
    });

    it('should have secureTextEntry enabled', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);
      const input = getByPlaceholderText('Contraseña');

      // Assert
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('login button', () => {
    it('should call onLogin when pressed', () => {
      // Arrange
      const { getByText } = render(<LoginForm {...defaultProps} />);

      // Act
      fireEvent.press(getByText('Ingresar'));

      // Assert
      expect(defaultProps.onLogin).toHaveBeenCalledTimes(1);
    });

    it('should show loading text when loading', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      const { getByText } = render(<LoginForm {...props} />);

      // Assert
      expect(getByText('Ingresando...')).toBeTruthy();
    });

    it('should be disabled when loading', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };
      const { getByText } = render(<LoginForm {...props} />);

      // Act
      fireEvent.press(getByText('Ingresando...'));

      // Assert
      expect(defaultProps.onLogin).not.toHaveBeenCalled();
    });
  });

  describe('register navigation button', () => {
    it('should call onNavigateToRegister when pressed', () => {
      // Arrange
      const { getByText } = render(<LoginForm {...defaultProps} />);

      // Act
      fireEvent.press(getByText('Ir a registro'));

      // Assert
      expect(defaultProps.onNavigateToRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe('email input attributes', () => {
    it('should have email keyboard type', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);
      const input = getByPlaceholderText('Correo electrónico');

      // Assert
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should have autoCapitalize none', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<LoginForm {...defaultProps} />);
      const input = getByPlaceholderText('Correo electrónico');

      // Assert
      expect(input.props.autoCapitalize).toBe('none');
    });
  });
});
