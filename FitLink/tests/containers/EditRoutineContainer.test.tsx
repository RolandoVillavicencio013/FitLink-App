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
import { useEditRoutineContainer } from '../../src/containers/EditRoutineContainer';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useRoutineForm } from '../../src/hooks/useRoutineForm';
import { getRoutineById, updateRoutine } from '../../src/services/repositories/routineRepository';
import { deleteRoutineExercises, insertRoutineExercises } from '../../src/services/repositories/exerciseRepository';

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

describe('EditRoutineContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useRoutineForm as jest.Mock).mockReturnValue(mockFormState);
  });

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.shouldBlockNavigation).toBe(true);
  });

  it('should load routine data on mount', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Loaded Routine',
        description: 'Loaded Description',
        estimated_time: 45,
        is_shared: true,
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 1,
            sets: 3,
            exercises: {
              exercise_id: 10,
              name: 'Exercise 1',
              description: 'Desc 1',
            },
          },
          {
            routine_exercise_id: 2,
            order: 2,
            sets: 5,
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
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(getRoutineById).toHaveBeenCalledWith('1');
  });

  it('should show alert and navigate back when routine load fails', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: null,
      error: { message: 'Routine not found' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo cargar la rutina');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('should handle unexpected error during load', async () => {
    (getRoutineById as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Ocurrió un error inesperado');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('should not submit when validation fails', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(false);
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    expect(mockFormState.validate).toHaveBeenCalled();
    expect(updateRoutine).not.toHaveBeenCalled();
  });

  it('should show alert when routineId is invalid during submit', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.handleSubmit).toBeDefined();
  });

  it('should successfully update routine and navigate back', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Updated Routine',
      description: 'Updated Desc',
      estimatedTime: 75,
      isShared: true,
      selectedExercises: [1, 2],
      exerciseSets: { 1: 4, 2: 5 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    (insertRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '5' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Éxito', 'Rutina actualizada exitosamente');
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('should call updateRoutine with correct data', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'My Updated Routine',
      description: 'My Updated Description',
      estimatedTime: 90,
      isShared: true,
      selectedExercises: [1],
      exerciseSets: { 1: 6 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    (insertRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '10' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(updateRoutine).toHaveBeenCalledWith('10', {
        name: 'My Updated Routine',
        description: 'My Updated Description',
        estimated_time: 90,
        is_shared: true,
      });
    });
  });

  it('should delete and insert exercises correctly', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [5, 10, 15],
      exerciseSets: { 5: 2, 10: 4, 15: 6 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    (insertRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '7' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(deleteRoutineExercises).toHaveBeenCalledWith('7');
      expect(insertRoutineExercises).toHaveBeenCalledWith(7, [
        { exercise_id: 5, sets: 2 },
        { exercise_id: 10, sets: 4 },
        { exercise_id: 15, sets: 6 },
      ]);
    });
  });

  it('should handle update error', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({
      error: { message: 'Update failed' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo actualizar la rutina');
    });
  });

  it('should handle delete exercises error', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({
      error: { message: 'Delete failed' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo actualizar la rutina');
    });
  });

  it('should handle insert exercises error', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    (insertRoutineExercises as jest.Mock).mockResolvedValue({
      error: { message: 'Insert failed' },
    });
    
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo actualizar la rutina');
    });
  });

  it('should set shouldBlockNavigation to false on success', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    (updateRoutine as jest.Mock).mockResolvedValue({ error: null });
    (deleteRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    (insertRoutineExercises as jest.Mock).mockResolvedValue({ error: null });
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.shouldBlockNavigation).toBe(true);
    
    await result.current.handleSubmit();
    
    await waitFor(() => {
      expect(result.current.shouldBlockNavigation).toBe(false);
    });
  });

  it('should set isSaving during submit', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    mockFormState.validate.mockReturnValue(true);
    mockFormState.getFormData.mockReturnValue({
      name: 'Test',
      description: 'Desc',
      estimatedTime: 60,
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: 3 },
    });
    
    let resolveUpdate!: (value: unknown) => void;
    (updateRoutine as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isSaving).toBe(false);
    
    result.current.handleSubmit();
    
    await waitFor(() => {
      expect(result.current.isSaving).toBe(true);
    });
    
    resolveUpdate!({ error: { message: 'Failed' } });
    
    await waitFor(() => {
      expect(result.current.isSaving).toBe(false);
    });
  });

  it('should include all form state properties', async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      routine: {
        name: 'Test',
        description: 'Desc',
        estimated_time: 60,
        is_shared: false,
        routine_exercises: [],
      },
      error: null,
    });
    
    const { result } = renderHook(() => useEditRoutineContainer({ routineId: '1' }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.name).toBeDefined();
    expect(result.current.description).toBeDefined();
    expect(result.current.estimatedTime).toBeDefined();
    expect(result.current.isShared).toBeDefined();
    expect(result.current.selectedExercises).toBeDefined();
    expect(result.current.exerciseSets).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
  });
});
