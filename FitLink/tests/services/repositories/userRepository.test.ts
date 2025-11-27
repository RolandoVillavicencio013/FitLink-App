import { getAuthUser, getUserByAuthId } from '../../../src/services/repositories/userRepository';
import { supabase } from '../../../src/services/supabase';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('userRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthUser', () => {
    it('should get authenticated user successfully', async () => {
      const mockUser = {
        id: 'auth123',
        email: 'test@example.com',
        aud: 'authenticated',
        role: 'authenticated',
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await getAuthUser();

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('should return error when getting auth user fails', async () => {
      const mockError = { message: 'Authentication error' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      const result = await getAuthUser();

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('should handle no authenticated user', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await getAuthUser();

      expect(result).toEqual({
        user: null,
        error: null,
      });
    });
  });

  describe('getUserByAuthId', () => {
    it('should get user by auth id successfully', async () => {
      const authId = 'auth123';
      const mockUser = {
        user_id: 1,
        auth_id: 'auth123',
      };

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getUserByAuthId(authId);

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(mockSelect).toHaveBeenCalledWith('user_id, auth_id');
      expect(mockEq).toHaveBeenCalledWith('auth_id', 'auth123');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });

    it('should return error when user not found', async () => {
      const authId = 'auth999';
      const mockError = { message: 'User not found' };

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getUserByAuthId(authId);

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('should return error when database query fails', async () => {
      const authId = 'auth123';
      const mockError = { message: 'Database error' };

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getUserByAuthId(authId);

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('should handle empty auth id string', async () => {
      const authId = '';
      const mockUser = {
        user_id: 1,
        auth_id: '',
      };

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getUserByAuthId(authId);

      expect(mockEq).toHaveBeenCalledWith('auth_id', '');
      expect(result).toEqual({
        user: mockUser,
        error: null,
      });
    });
  });
});
