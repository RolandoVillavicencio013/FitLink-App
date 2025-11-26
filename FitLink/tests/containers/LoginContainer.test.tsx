jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock('../../src/services/authService');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react-native';
import { useLoginContainer } from '../../src/containers/LoginContainer';
import { loginUser } from '../../src/services/authService';
import { useRouter } from 'expo-router';

describe('useLoginContainer', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('updateField', () => {
    it('should update email field', () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());

      // Act
      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      // Assert
      expect(result.current.formData.email).toBe('test@example.com');
    });

    it('should update password field', () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());

      // Act
      act(() => {
        result.current.updateField('password', 'mypassword');
      });

      // Assert
      expect(result.current.formData.password).toBe('mypassword');
    });

    it('should clear email error when user types', () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      act(() => {
        result.current.handleLogin();
      });

      // Act
      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      // Assert
      expect(result.current.errors.email).toBeUndefined();
    });

    it('should clear password error when user types', () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      act(() => {
        result.current.handleLogin();
      });

      // Act
      act(() => {
        result.current.updateField('password', 'password123');
      });

      // Assert
      expect(result.current.errors.password).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should return error when email is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.errors.email).toBe('El correo electrónico es obligatorio');
    });

    it('should return error when password is empty', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      act(() => {
        result.current.updateField('email', 'test@example.com');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.errors.password).toBe('La contraseña es obligatoria');
    });

    it('should return no errors when all fields are valid', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.errors.email).toBeUndefined();
      expect(result.current.errors.password).toBeUndefined();
    });
  });

  describe('handleLogin', () => {
    it('should not call loginUser when validation fails', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(loginUser).not.toHaveBeenCalled();
    });

    it('should call loginUser with correct credentials', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should navigate to home on successful login', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/home');
    });

    it('should set loading to true during login', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      act(() => {
        result.current.handleLogin();
      });

      // Assert
      expect(result.current.loading).toBe(true);
    });

    it('should set loading to false after successful login', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockResolvedValue({ id: '123' });
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.loading).toBe(false);
    });

    it('should set error for invalid credentials', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      const error = new Error('Invalid login credentials');
      (loginUser as jest.Mock).mockRejectedValue(error);
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'wrongpassword');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.errors.email).toBe('Credenciales inválidas');
    });

    it('should set generic error for other errors', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      const error = new Error('Network error');
      (loginUser as jest.Mock).mockRejectedValue(error);
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.errors.email).toBe('Error en login');
    });

    it('should set loading to false after error', async () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());
      (loginUser as jest.Mock).mockRejectedValue(new Error('Error'));
      act(() => {
        result.current.updateField('email', 'test@example.com');
        result.current.updateField('password', 'password123');
      });

      // Act
      await act(async () => {
        await result.current.handleLogin();
      });

      // Assert
      expect(result.current.loading).toBe(false);
    });
  });

  describe('navigateToRegister', () => {
    it('should navigate to register screen', () => {
      // Arrange
      const { result } = renderHook(() => useLoginContainer());

      // Act
      act(() => {
        result.current.navigateToRegister();
      });

      // Assert
      expect(mockRouter.push).toHaveBeenCalledWith('/register');
    });
  });
});
