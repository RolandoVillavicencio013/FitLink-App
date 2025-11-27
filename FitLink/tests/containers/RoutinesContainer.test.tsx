jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));
jest.mock('../../src/services/repositories/routineRepository');
jest.mock('@react-navigation/native');

import { renderHook, waitFor } from '@testing-library/react-native';
import { useRoutinesContainer } from '../../src/containers/RoutinesContainer';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/services/supabase';
import { getRoutinesByUserId } from '../../src/services/repositories/routineRepository';
import { useFocusEffect } from '@react-navigation/native';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

describe('RoutinesContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useFocusEffect as jest.Mock).mockImplementation((callback) => {
      setTimeout(() => {
        const cleanup = callback();
        if (cleanup) cleanup();
      }, 0);
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRoutinesContainer());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.routines).toEqual([]);
    expect(result.current.searchQuery).toBe('');
  });

  it('should load routines on mount', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [
        {
          routine_id: 1,
          name: 'Test Routine',
          description: 'Description',
          is_shared: false,
          created_at: '2024-01-01',
          user_id: '1',
          estimated_time: 60,
          routine_exercises: [],
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toHaveLength(1);
    expect(result.current.routines[0].name).toBe('Test Routine');
    expect(getRoutinesByUserId).toHaveBeenCalledWith(1);
  });

  it('should handle auth error', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth error' },
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toEqual([]);
    expect(getRoutinesByUserId).not.toHaveBeenCalled();
  });

  it('should handle missing user', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toEqual([]);
  });

  it('should handle user lookup error', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'User not found' },
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toEqual([]);
    expect(getRoutinesByUserId).not.toHaveBeenCalled();
  });

  it('should handle missing user data', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toEqual([]);
  });

  it('should handle getRoutinesByUserId error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: null,
      error: { message: 'Database error' },
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith({ message: 'Database error' });
    expect(result.current.routines).toEqual([]);
    
    consoleSpy.mockRestore();
  });

  it('should handle unexpected errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (supabase.auth.getUser as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.routines).toEqual([]);
    
    consoleSpy.mockRestore();
  });

  it('should filter routines by search query', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [
        {
          routine_id: 1,
          name: 'Cardio Routine',
          description: 'Description',
          is_shared: false,
          created_at: '2024-01-01',
          user_id: '1',
          estimated_time: 60,
          routine_exercises: [],
        },
        {
          routine_id: 2,
          name: 'Strength Training',
          description: 'Description',
          is_shared: false,
          created_at: '2024-01-02',
          user_id: '1',
          estimated_time: 90,
          routine_exercises: [],
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toHaveLength(2);
    
    result.current.setSearchQuery('cardio');
    
    await waitFor(() => {
      expect(result.current.routines).toHaveLength(1);
      expect(result.current.routines[0].name).toBe('Cardio Routine');
    });
  });

  it('should filter routines case insensitive', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [
        {
          routine_id: 1,
          name: 'Morning Workout',
          description: 'Description',
          is_shared: false,
          created_at: '2024-01-01',
          user_id: '1',
          estimated_time: 60,
          routine_exercises: [],
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.setSearchQuery('MORNING');
    
    await waitFor(() => {
      expect(result.current.routines).toHaveLength(1);
      expect(result.current.routines[0].name).toBe('Morning Workout');
    });
  });

  it('should navigate to routine detail', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.navigateToRoutine(5);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/routines/5');
  });

  it('should navigate to add routine', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.navigateToAddRoutine();
    
    expect(mockRouter.push).toHaveBeenCalledWith('/routines/add-routine');
  });

  it('should handle null routines data', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: null,
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routines).toEqual([]);
  });

  it('should update search query', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth-123' } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 1 },
            error: null,
          }),
        }),
      }),
    });

    (getRoutinesByUserId as jest.Mock).mockResolvedValue({
      routines: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutinesContainer());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.searchQuery).toBe('');
    
    result.current.setSearchQuery('test');
    
    await waitFor(() => {
      expect(result.current.searchQuery).toBe('test');
    });
  });
});
