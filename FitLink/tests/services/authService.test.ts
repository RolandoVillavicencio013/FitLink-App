import { registerUser, loginUser } from '../../src/services/authService';
import { supabase } from '../../src/services/supabase';

// Mock Supabase
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should call signUp with correct credentials', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      // Act
      await registerUser('test@example.com', 'password123', 'testuser', 'Test User');

      // Assert
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should insert user data into database after signup', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      // Act
      await registerUser('test@example.com', 'password123', 'testuser', 'Test User');

      // Assert
      expect(mockInsert).toHaveBeenCalledWith([{
        auth_id: 'user-123',
        username: 'testuser',
        full_name: 'Test User',
        role_id: 2,
      }]);
    });

    it('should return user data on successful registration', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      // Act
      const result = await registerUser('test@example.com', 'password123', 'testuser', 'Test User');

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should throw error when signUp fails', async () => {
      // Arrange
      const mockError = new Error('Email already registered');
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      // Act & Assert
      await expect(
        registerUser('test@example.com', 'password123', 'testuser', 'Test User')
      ).rejects.toThrow('Email already registered');
    });

    it('should throw error when user insert fails', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockInsertError = new Error('Database insert failed');
      const mockInsert = jest.fn().mockResolvedValue({ error: mockInsertError });
      
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      // Act & Assert
      await expect(
        registerUser('test@example.com', 'password123', 'testuser', 'Test User')
      ).rejects.toThrow('Database insert failed');
    });
  });

  describe('loginUser', () => {
    it('should call signInWithPassword with correct credentials', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Act
      await loginUser('test@example.com', 'password123');

      // Assert
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return user data on successful login', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Act
      const result = await loginUser('test@example.com', 'password123');

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should throw error when credentials are invalid', async () => {
      // Arrange
      const mockError = new Error('Invalid login credentials');
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      // Act & Assert
      await expect(
        loginUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid login credentials');
    });

    it('should throw error when email does not exist', async () => {
      // Arrange
      const mockError = new Error('User not found');
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      // Act & Assert
      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow('User not found');
    });
  });
});
