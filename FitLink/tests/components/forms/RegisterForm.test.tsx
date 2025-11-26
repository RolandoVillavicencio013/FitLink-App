import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RegisterForm } from '../../../src/components/forms/RegisterForm';

describe('RegisterForm', () => {
  const defaultProps = {
    fullName: '',
    email: '',
    username: '',
    password: '',
    loading: false,
    onFullNameChange: jest.fn(),
    onEmailChange: jest.fn(),
    onUsernameChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onRegister: jest.fn(),
    onNavigateToLogin: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render title', () => {
      // Arrange & Act
      const { getByText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByText('Registro')).toBeTruthy();
    });

    it('should render fullName input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Nombre completo')).toBeTruthy();
    });

    it('should render email input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    });

    it('should render username input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Nombre de usuario')).toBeTruthy();
    });

    it('should render password input', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    });

    it('should render register button', () => {
      // Arrange & Act
      const { getByText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByText('Registrarse')).toBeTruthy();
    });

    it('should render login navigation button', () => {
      // Arrange & Act
      const { getByText } = render(<RegisterForm {...defaultProps} />);

      // Assert
      expect(getByText('Ya tengo cuenta')).toBeTruthy();
    });
  });

  describe('fullName input', () => {
    it('should display fullName value', () => {
      // Arrange
      const props = { ...defaultProps, fullName: 'John Doe' };

      // Act
      const { getByDisplayValue } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByDisplayValue('John Doe')).toBeTruthy();
    });

    it('should call onFullNameChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Nombre completo'), 'Jane Doe');

      // Assert
      expect(defaultProps.onFullNameChange).toHaveBeenCalledWith('Jane Doe');
    });

    it('should display fullName error', () => {
      // Arrange
      const props = { ...defaultProps, fullNameError: 'Nombre requerido' };

      // Act
      const { getByText } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByText('Nombre requerido')).toBeTruthy();
    });
  });

  describe('email input', () => {
    it('should display email value', () => {
      // Arrange
      const props = { ...defaultProps, email: 'test@example.com' };

      // Act
      const { getByDisplayValue } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('should call onEmailChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Correo electrónico'), 'new@example.com');

      // Assert
      expect(defaultProps.onEmailChange).toHaveBeenCalledWith('new@example.com');
    });

    it('should display email error', () => {
      // Arrange
      const props = { ...defaultProps, emailError: 'Email inválido' };

      // Act
      const { getByText } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByText('Email inválido')).toBeTruthy();
    });

    it('should have email keyboard type', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);
      const input = getByPlaceholderText('Correo electrónico');

      // Assert
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should have autoCapitalize none', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);
      const input = getByPlaceholderText('Correo electrónico');

      // Assert
      expect(input.props.autoCapitalize).toBe('none');
    });
  });

  describe('username input', () => {
    it('should display username value', () => {
      // Arrange
      const props = { ...defaultProps, username: 'johndoe' };

      // Act
      const { getByDisplayValue } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByDisplayValue('johndoe')).toBeTruthy();
    });

    it('should call onUsernameChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'newuser');

      // Assert
      expect(defaultProps.onUsernameChange).toHaveBeenCalledWith('newuser');
    });

    it('should display username error', () => {
      // Arrange
      const props = { ...defaultProps, usernameError: 'Username requerido' };

      // Act
      const { getByText } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByText('Username requerido')).toBeTruthy();
    });
  });

  describe('password input', () => {
    it('should display password value', () => {
      // Arrange
      const props = { ...defaultProps, password: 'mypassword' };

      // Act
      const { getByDisplayValue } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByDisplayValue('mypassword')).toBeTruthy();
    });

    it('should call onPasswordChange when text changes', () => {
      // Arrange
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.changeText(getByPlaceholderText('Contraseña'), 'newpassword');

      // Assert
      expect(defaultProps.onPasswordChange).toHaveBeenCalledWith('newpassword');
    });

    it('should display password error', () => {
      // Arrange
      const props = { ...defaultProps, passwordError: 'Contraseña muy corta' };

      // Act
      const { getByText } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByText('Contraseña muy corta')).toBeTruthy();
    });

    it('should have secureTextEntry enabled', () => {
      // Arrange & Act
      const { getByPlaceholderText } = render(<RegisterForm {...defaultProps} />);
      const input = getByPlaceholderText('Contraseña');

      // Assert
      expect(input.props.secureTextEntry).toBe(true);
    });
  });

  describe('register button', () => {
    it('should call onRegister when pressed', () => {
      // Arrange
      const { getByText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.press(getByText('Registrarse'));

      // Assert
      expect(defaultProps.onRegister).toHaveBeenCalledTimes(1);
    });

    it('should show loading text when loading', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      const { getByText } = render(<RegisterForm {...props} />);

      // Assert
      expect(getByText('Registrando...')).toBeTruthy();
    });

    it('should be disabled when loading', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };
      const { getByText } = render(<RegisterForm {...props} />);

      // Act
      fireEvent.press(getByText('Registrando...'));

      // Assert
      expect(defaultProps.onRegister).not.toHaveBeenCalled();
    });
  });

  describe('login navigation button', () => {
    it('should call onNavigateToLogin when pressed', () => {
      // Arrange
      const { getByText } = render(<RegisterForm {...defaultProps} />);

      // Act
      fireEvent.press(getByText('Ya tengo cuenta'));

      // Assert
      expect(defaultProps.onNavigateToLogin).toHaveBeenCalledTimes(1);
    });
  });
});
