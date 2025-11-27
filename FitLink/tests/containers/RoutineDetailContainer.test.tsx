jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));
jest.mock('../../src/services/repositories/routineRepository');
jest.mock('../../src/services/delete-routine');
jest.mock('@react-navigation/native');

import { renderHook, waitFor } from '@testing-library/react-native';
import { useRoutineDetailContainer } from '../../src/containers/RoutineDetailContainer';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { getRoutineById } from '../../src/services/repositories/routineRepository';
import { deleteRoutine } from '../../src/services/delete-routine';
import { useFocusEffect } from '@react-navigation/native';

const mockRouter = {
  replace: jest.fn(),
  back: jest.fn(),
  push: jest.fn(),
};

describe('RoutineDetailContainer', () => {
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

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.routine).toBeNull();
    expect(useFocusEffect).toHaveBeenCalled();
  });

  it('should load routine detail on mount', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test Routine',
        description: 'Test Description',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 2,
            sets: 3,
            exercises: {
              exercise_id: 10,
              name: 'Exercise 1',
              description: 'Desc 1',
            },
          },
          {
            routine_exercise_id: 2,
            order: 1,
            sets: 4,
            exercises: {
              exercise_id: 20,
              name: 'Exercise 2',
              description: 'Desc 2',
            },
          },
        ],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routine).toBeDefined();
    expect(result.current.routine?.name).toBe('Test Routine');
    expect(getRoutineById).toHaveBeenCalledWith('1');
  });

  it('should sort exercises by order', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 3,
            sets: 3,
            exercises: {
              exercise_id: 10,
              name: 'Third',
              description: null,
            },
          },
          {
            routine_exercise_id: 2,
            order: 1,
            sets: 4,
            exercises: {
              exercise_id: 20,
              name: 'First',
              description: null,
            },
          },
          {
            routine_exercise_id: 3,
            order: 2,
            sets: 5,
            exercises: {
              exercise_id: 30,
              name: 'Second',
              description: null,
            },
          },
        ],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routine?.routine_exercises[0].exercises?.name).toBe('First');
    expect(result.current.routine?.routine_exercises[1].exercises?.name).toBe('Second');
    expect(result.current.routine?.routine_exercises[2].exercises?.name).toBe('Third');
  });

  it('should not load routine if routineId is undefined on mount', async () => {
    renderHook(() => useRoutineDetailContainer(undefined));
    
    await waitFor(() => {
      expect(getRoutineById).not.toHaveBeenCalled();
    });
    
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('should show alert when routine load fails', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: null,
      error: { message: 'Not found' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo cargar la rutina');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('should handle unexpected errors', async () => {
    (getRoutineById as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Ocurrió un error inesperado');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('should handle null exercises', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 1,
            sets: 3,
            exercises: null,
          },
        ],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routine?.routine_exercises[0].exercises).toBeNull();
  });

  it('should handle empty exercises array', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routine?.routine_exercises).toEqual([]);
  });

  it('should navigate to edit page when handleEdit is called', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('5'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.handleEdit();
    
    expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/routines/edit-routine/5');
  });

  it('should call deleteRoutine when handleDelete is called', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('10'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.handleDelete();
    
    expect(deleteRoutine).toHaveBeenCalledWith({
      routineId: '10',
      onSuccess: expect.any(Function),
    });
  });

  it('should navigate back on delete success', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 1,
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        created_at: '2024-01-01',
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    (deleteRoutine as jest.Mock).mockImplementation(({ onSuccess }) => {
      onSuccess();
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.handleDelete();
    
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should include all routine properties', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        routine_id: 123,
        name: 'My Routine',
        description: 'My Description',
        estimated_time: 90,
        created_at: '2024-12-01',
        is_shared: true,
        routine_exercises: [],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useRoutineDetailContainer('1'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.routine?.routine_id).toBe(123);
    expect(result.current.routine?.name).toBe('My Routine');
    expect(result.current.routine?.description).toBe('My Description');
    expect(result.current.routine?.estimated_time).toBe(90);
    expect(result.current.routine?.created_at).toBe('2024-12-01');
    expect(result.current.routine?.is_shared).toBe(true);
  });
});
