jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock('../../src/services/authService');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react-native';
import { useRegisterContainer } from '../../src/containers/RegisterContainer';
import { registerUser } from '../../src/services/authService';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';

describe('useRegisterContainer', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.window.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('updateField', () => {
    it('should update fullName field', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      act(() => {
        result.current.updateField('fullName', 'John Doe');
      });

      // Assert
      expect(result.current.formData.fullName).toBe('John Doe');
    });

    it('should update email field', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      // Assert
      expect(result.current.formData.email).toBe('test@example.com');
    });

    it('should update username field', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      act(() => {
        result.current.updateField('username', 'johndoe');
      });

      // Assert
      expect(result.current.formData.username).toBe('johndoe');
    });

    it('should update password field', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      act(() => {
        result.current.updateField('password', 'password123');
      });

      // Assert
      expect(result.current.formData.password).toBe('password123');
    });

    it('should clear fullName error when user types', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.handleRegister();
      });

      // Act
      act(() => {
        result.current.updateField('fullName', 'John');
      });

      // Assert
      expect(result.current.errors.fullName).toBeUndefined();
    });

    it('should clear email error when user types', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.handleRegister();
      });

      // Act
      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      // Assert
      expect(result.current.errors.email).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should return error when fullName is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.fullName).toBe('El nombre completo es obligatorio');
    });

    it('should return error when email is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.updateField('fullName', 'John Doe');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.email).toBe('El correo electrónico es obligatorio');
    });

    it('should return error when email format is invalid', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'invalid-email');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.email).toBe('El formato del correo electrónico no es válido');
    });

    it('should return error when username is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.username).toBe('El nombre de usuario es obligatorio');
    });

    it('should return error when password is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.password).toBe('La contraseña es obligatoria');
    });

    it('should return error when password is less than 6 characters', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', '12345');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('should return no errors when all fields are valid', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.errors).toEqual({});
    });
  });

  describe('handleRegister', () => {
    it('should not call registerUser when validation fails', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(registerUser).not.toHaveBeenCalled();
    });

    it('should call registerUser with correct data', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(registerUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'johndoe',
        'John Doe'
      );
    });

    it('should navigate to login on successful registration', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });

    it('should set loading to true during registration', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      act(() => {
        result.current.handleRegister();
      });

      // Assert
      expect(result.current.loading).toBe(true);
    });

    it('should set loading to false after successful registration', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.loading).toBe(false);
    });

    it('should show alert on web when registration fails', async () => {
      // Arrange
      Platform.OS = 'web';
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockRejectedValue(new Error('Registration failed'));
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(alertSpy).toHaveBeenCalledWith('No se pudo completar el registro. Por favor verifica tus datos e intenta nuevamente.');
      alertSpy.mockRestore();
    });

    it('should set loading to false after error', async () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());
      (registerUser as jest.Mock).mockRejectedValue(new Error('Error'));
      act(() => {
        result.current.updateField('fullName', 'John Doe');
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('username', 'johndoe');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleRegister();
      });

      // Assert
      expect(result.current.loading).toBe(false);
    });
  });

  describe('navigateToLogin', () => {
    it('should navigate to login screen', () => {
      // Arrange
      const { result } = renderHook(() => useRegisterContainer());

      // Act
      act(() => {
        result.current.navigateToLogin();
      });

      // Assert
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });
});
