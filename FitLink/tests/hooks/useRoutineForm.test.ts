import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useRoutineForm } from '../../src/hooks/useRoutineForm';

const mockGetAllExercises = jest.fn();

jest.mock('../../src/services/repositories/exerciseRepository', () => ({
  getAllExercises: () => mockGetAllExercises(),
}));

describe('useRoutineForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    expect(result.current.name).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.estimatedTime).toBe('');
    expect(result.current.isShared).toBe(false);
    expect(result.current.selectedExercises).toEqual([]);
    expect(result.current.exerciseSets).toEqual({});
    expect(result.current.searchQuery).toBe('');
    expect(result.current.errors).toEqual({});
  });

  it('should initialize with initial data', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test Routine',
      description: 'Test Description',
      estimatedTime: '60',
      isShared: true,
      selectedExercises: [1, 2],
      exerciseSets: { 1: '3', 2: '4' },
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    expect(result.current.name).toBe('Test Routine');
    expect(result.current.description).toBe('Test Description');
    expect(result.current.estimatedTime).toBe('60');
    expect(result.current.isShared).toBe(true);
    expect(result.current.selectedExercises).toEqual([1, 2]);
    expect(result.current.exerciseSets).toEqual({ 1: '3', 2: '4' });
  });

  it('should load exercises on mount', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [
        { exercise_id: 1, name: 'Push-ups' },
        { exercise_id: 2, name: 'Squats' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(2);
    });

    expect(mockGetAllExercises).toHaveBeenCalled();
    expect(result.current.availableExercises[0].name).toBe('Push-ups');
  });

  it('should handle exercise loading error', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: null,
      error: { message: 'Error loading exercises' },
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toEqual([]);
    });
  });

  it('should update name and clear error', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBe('El nombre es requerido');

    act(() => {
      result.current.handleNameChange('New Routine');
    });

    expect(result.current.name).toBe('New Routine');
    expect(result.current.errors.name).toBeUndefined();
  });

  it('should update description and clear error', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.description).toBe('La descripción es requerida');

    act(() => {
      result.current.handleDescriptionChange('New Description');
    });

    expect(result.current.description).toBe('New Description');
    expect(result.current.errors.description).toBeUndefined();
  });

  it('should update estimated time and clear error', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.estimatedTime).toBe('El tiempo estimado debe ser un número');

    act(() => {
      result.current.handleEstimatedTimeChange('60');
    });

    expect(result.current.estimatedTime).toBe('60');
    expect(result.current.errors.estimatedTime).toBeUndefined();
  });

  it('should add exercise and clear error', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(1);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.exercises).toBe('Debes seleccionar al menos un ejercicio');

    act(() => {
      result.current.addExercise(1);
    });

    expect(result.current.selectedExercises).toEqual([1]);
    expect(result.current.exerciseSets).toEqual({ 1: '3' });
    expect(result.current.errors.exercises).toBeUndefined();
  });

  it('should remove exercise', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: '3' },
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    await waitFor(() => {
      expect(result.current.selectedExercises).toEqual([1]);
    });

    act(() => {
      result.current.removeExercise(1);
    });

    expect(result.current.selectedExercises).toEqual([]);
    expect(result.current.exerciseSets).toEqual({});
  });

  it('should update sets and clear error', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(1);
    });

    act(() => {
      result.current.addExercise(1);
      result.current.handleSetsChange(1, '0');
    });

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.sets).toBe('Debes ingresar el número de sets para cada ejercicio');

    act(() => {
      result.current.handleSetsChange(1, '5');
    });

    expect(result.current.exerciseSets[1]).toBe('5');
    expect(result.current.errors.sets).toBeUndefined();
  });

  it('should validate empty form', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.name).toBe('El nombre es requerido');
    expect(result.current.errors.description).toBe('La descripción es requerida');
    expect(result.current.errors.estimatedTime).toBe('El tiempo estimado debe ser un número');
    expect(result.current.errors.exercises).toBe('Debes seleccionar al menos un ejercicio');
  });

  it('should validate invalid estimated time', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.handleNameChange('Test');
      result.current.handleDescriptionChange('Test');
      result.current.handleEstimatedTimeChange('invalid');
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.estimatedTime).toBe('El tiempo estimado debe ser un número');
  });

  it('should validate invalid sets', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(1);
    });

    act(() => {
      result.current.handleNameChange('Test');
      result.current.handleDescriptionChange('Test');
      result.current.handleEstimatedTimeChange('60');
      result.current.addExercise(1);
      result.current.handleSetsChange(1, '0');
    });

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.sets).toBe('Debes ingresar el número de sets para cada ejercicio');
  });

  it('should validate valid form', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(1);
    });

    act(() => {
      result.current.handleNameChange('Test Routine');
      result.current.handleDescriptionChange('Test Description');
      result.current.handleEstimatedTimeChange('60');
      result.current.addExercise(1);
    });

    act(() => {
      result.current.handleSetsChange(1, '3');
    });

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(true);
    });

    expect(result.current.errors).toEqual({});
  });

  it('should return form data', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [{ exercise_id: 1, name: 'Push-ups' }],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(1);
    });

    act(() => {
      result.current.handleNameChange('Test Routine');
      result.current.handleDescriptionChange('Test Description');
      result.current.handleEstimatedTimeChange('60');
      result.current.setIsShared(true);
      result.current.addExercise(1);
      result.current.handleSetsChange(1, '5');
    });

    const formData = result.current.getFormData();

    expect(formData).toEqual({
      name: 'Test Routine',
      description: 'Test Description',
      estimatedTime: 60,
      isShared: true,
      selectedExercises: [1],
      exerciseSets: { 1: 5 },
    });
  });

  it('should filter available exercises by search query', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [
        { exercise_id: 1, name: 'Push-ups' },
        { exercise_id: 2, name: 'Squats' },
        { exercise_id: 3, name: 'Pull-ups' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(3);
    });

    act(() => {
      result.current.setSearchQuery('push');
    });

    expect(result.current.availableExercises).toHaveLength(1);
    expect(result.current.availableExercises[0].name).toBe('Push-ups');
  });

  it('should filter available exercises case insensitive', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [
        { exercise_id: 1, name: 'Push-ups' },
        { exercise_id: 2, name: 'Squats' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(2);
    });

    act(() => {
      result.current.setSearchQuery('PUSH');
    });

    expect(result.current.availableExercises).toHaveLength(1);
    expect(result.current.availableExercises[0].name).toBe('Push-ups');
  });

  it('should exclude selected exercises from available exercises', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [
        { exercise_id: 1, name: 'Push-ups' },
        { exercise_id: 2, name: 'Squats' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(2);
    });

    act(() => {
      result.current.addExercise(1);
    });

    expect(result.current.availableExercises).toHaveLength(1);
    expect(result.current.availableExercises[0].name).toBe('Squats');
  });

  it('should return selected exercises details', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [
        { exercise_id: 1, name: 'Push-ups' },
        { exercise_id: 2, name: 'Squats' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    await waitFor(() => {
      expect(result.current.availableExercises).toHaveLength(2);
    });

    act(() => {
      result.current.addExercise(1);
    });

    act(() => {
      result.current.addExercise(2);
    });

    await waitFor(() => {
      expect(result.current.selectedExercisesDetails).toHaveLength(2);
    });

    expect(result.current.selectedExercisesDetails[0].name).toBe('Push-ups');
    expect(result.current.selectedExercisesDetails[1].name).toBe('Squats');
  });

  it('should detect no changes when form is empty', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    expect(result.current.hasChanges()).toBe(false);
  });

  it('should detect changes when form has content', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.handleNameChange('Test');
    });

    expect(result.current.hasChanges()).toBe(true);
  });

  it('should detect changes compared to initial data', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: '3' },
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    expect(result.current.hasChanges()).toBe(false);

    act(() => {
      result.current.handleNameChange('Modified');
    });

    expect(result.current.hasChanges()).toBe(true);
  });

  it('should detect changes in isShared', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [],
      exerciseSets: {},
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    act(() => {
      result.current.setIsShared(true);
    });

    expect(result.current.hasChanges()).toBe(true);
  });

  it('should update initialData when it changes', async () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [] as number[],
      exerciseSets: {} as { [key: number]: string },
    };

    const { result, rerender } = renderHook(
      (props: { data: typeof initialData }) => useRoutineForm({ initialData: props.data }),
      { initialProps: { data: initialData } }
    );

    expect(result.current.name).toBe('Test');

    const newData = {
      name: 'Updated',
      description: 'Updated',
      estimatedTime: '90',
      isShared: true,
      selectedExercises: [1],
      exerciseSets: { 1: '4' },
    };

    rerender({ data: newData });

    await waitFor(() => {
      expect(result.current.name).toBe('Updated');
      expect(result.current.description).toBe('Updated');
      expect(result.current.estimatedTime).toBe('90');
      expect(result.current.isShared).toBe(true);
    });
  });

  it('should not update if initialData is the same object', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [] as number[],
      exerciseSets: {} as { [key: number]: string },
    };

    const { result, rerender } = renderHook(
      (props: { data: typeof initialData }) => useRoutineForm({ initialData: props.data }),
      { initialProps: { data: initialData } }
    );

    act(() => {
      result.current.handleNameChange('Manual Change');
    });

    expect(result.current.name).toBe('Manual Change');

    rerender({ data: initialData });

    expect(result.current.name).toBe('Manual Change');
  });

  it('should trim whitespace in getFormData', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const { result } = renderHook(() => useRoutineForm());

    act(() => {
      result.current.handleNameChange('  Test  ');
      result.current.handleDescriptionChange('  Description  ');
    });

    const formData = result.current.getFormData();

    expect(formData.name).toBe('Test');
    expect(formData.description).toBe('Description');
  });

  it('should handle changes in selected exercises order', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [1, 2, 3],
      exerciseSets: { 1: '3', 2: '4', 3: '5' },
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    expect(result.current.hasChanges()).toBe(false);
  });

  it('should detect changes in exerciseSets', () => {
    mockGetAllExercises.mockResolvedValue({
      exercises: [],
      error: null,
    });

    const initialData = {
      name: 'Test',
      description: 'Test',
      estimatedTime: '60',
      isShared: false,
      selectedExercises: [1],
      exerciseSets: { 1: '3' },
    };

    const { result } = renderHook(() => useRoutineForm({ initialData }));

    act(() => {
      result.current.handleSetsChange(1, '5');
    });

    expect(result.current.hasChanges()).toBe(true);
  });
});
