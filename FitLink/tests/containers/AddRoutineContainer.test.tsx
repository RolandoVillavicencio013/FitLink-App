jest.mock('../../src/services/repositories/exerciseRepository');
jest.mock('../../src/services/repositories/routineRepository');
jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn() },
    from: jest.fn(),
  },
}));
jest.mock('../../src/hooks/useRoutineForm');

import { renderHook, waitFor } from '@testing-library/react-native';
import { useAddRoutineContainer } from '../../src/containers/AddRoutineContainer';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useRoutineForm } from '../../src/hooks/useRoutineForm';
import { supabase } from '../../src/services/supabase';
import { createRoutine } from '../../src/services/repositories/routineRepository';
import { insertRoutineExercises } from '../../src/services/repositories/exerciseRepository';

const mockRouter = {
  replace: jest.fn(),
  back: jest.fn(),
  push: jest.fn(),
};

const mockFormState = {
  name: 'Test Routine',
  description: 'Test Description',
  estimatedTime: '60',
  isShared: false,
  selectedExercises: [1, 2],
  exerciseSets: { 1: '3', 2: '4' },
  errors: {},
  setName: jest.fn(),
  setDescription: jest.fn(),
  setEstimatedTime: jest.fn(),
  setIsShared: jest.fn(),
  addExercise: jest.fn(),
  removeExercise: jest.fn(),
  updateExerciseSets: jest.fn(),
  validate: jest.fn(),
  getFormData: jest.fn(),
  reset: jest.fn(),
};

describe('AddRoutineContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useRoutineForm as jest.Mock).mockReturnValue(mockFormState);
  });

  it('should return initial state with form state and loading false', () => {
    const { result } = renderHook(() => useAddRoutineContainer());
    
    expect(result.current.name).toBe('Test Routine');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.shouldBlockNavigation).toBe(true);
  });

  it('should include all form state properties', () => {
    const { result } = renderHook(() => useAddRoutineContainer());
    
    expect(result.current.name).toBeDefined();
    expect(result.current.description).toBeDefined();
    expect(result.current.estimatedTime).toBeDefined();
    expect(result.current.isShared).toBeDefined();
    expect(result.current.selectedExercises).toBeDefined();
    expect(result.current.exerciseSets).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
  });

  it('should not submit when validation fails', async () => {
    mockFormState.validate.mockReturnValue(false);
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    expect(mockFormState.validate).toHaveBeenCalled();
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it('should show alert when user is not authenticated', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Usuario no autenticado');
    });
  });

  it('should show alert when db user is not found', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudieron obtener tus datos');
    });
  });

  it('should show alert when routine creation fails', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: null,
      error: { message: 'Failed to create' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo crear la rutina');
    });
  });

  it('should show alert when inserting exercises fails', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1, 2],
      exerciseSets: { 1: 3, 2: 4 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: { routine_id: 10, name: 'Test' },
      error: null,
    });
    
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: { message: 'Failed to insert exercises' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudieron agregar los ejercicios');
    });
  });

  it('should successfully create routine and navigate', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1, 2],
      exerciseSets: { 1: 3, 2: 4 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: { routine_id: 10, name: 'Test' },
      error: null,
    });
    
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/routines');
    });
  });

  it('should call createRoutine with correct data', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'My Routine',
      description: 'My Description',
      estimatedTime: 45,
      isShared: true,
      selectedExercises: [1],
      exerciseSets: { 1: 5 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
      error: null,
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_id: 5 },
            error: null,
          }),
        }),
      }),
    });
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: { routine_id: 10, name: 'My Routine' },
      error: null,
    });
    
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(createRoutine).toHaveBeenCalledWith(5, {
        name: 'My Routine',
        description: 'My Description',
        estimated_time: 45,
        is_shared: true,
      });
    });
  });

  it('should call insertRoutineExercises with correct exercises', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1, 2, 3],
      exerciseSets: { 1: 3, 2: 4, 3: 5 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: { routine_id: 10, name: 'Test' },
      error: null,
    });
    
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(insertRoutineExercises).toHaveBeenCalledWith(10, [
        { exercise_id: 1, sets: 3 },
        { exercise_id: 2, sets: 4 },
        { exercise_id: 3, sets: 5 },
      ]);
    });
  });

  it('should handle unexpected errors', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Ocurrió un error inesperado');
    });
  });

  it('should set shouldBlockNavigation to false on success', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
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
    
    (createRoutine as jest.Mock).mockResolvedValue({
      routine: { routine_id: 10, name: 'Test' },
      error: null,
    });
    
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    expect(result.current.shouldBlockNavigation).toBe(true);
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(result.current.shouldBlockNavigation).toBe(false);
    });
  });

  it('should set isLoading during submit', async () => {
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    let resolveGetUser!: (value: unknown) => void;
    (supabase.auth.getUser as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveGetUser = resolve;
      })
    );
    
    const { result } = renderHook(() => useAddRoutineContainer());
    
    expect(result.current.isLoading).toBe(false);
    
    result.current.handleSubmit();
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
    
    resolveGetUser({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
