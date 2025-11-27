import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TrainingSessionView, Routine } from '../../../src/components/views/TrainingSessionView';
import { useTimer } from '../../../src/hooks/useTimer';
import { useExerciseState } from '../../../src/hooks/useExerciseState';
import { buildFinalizedSets } from '../../../src/utils/trainingSessionUtils';
import { ExerciseBlock } from '../../../src/components/training/ExerciseBlock';

jest.mock('../../../src/hooks/useTimer');
jest.mock('../../../src/hooks/useExerciseState');
jest.mock('../../../src/utils/trainingSessionUtils');
jest.mock('../../../src/components/training/ExerciseBlock', () => ({
  ExerciseBlock: jest.fn(() => null),
}));

const mockUseTimer = useTimer as jest.MockedFunction<typeof useTimer>;
const mockUseExerciseState = useExerciseState as jest.MockedFunction<typeof useExerciseState>;
const mockBuildFinalizedSets = buildFinalizedSets as jest.MockedFunction<typeof buildFinalizedSets>;
const MockExerciseBlock = ExerciseBlock as jest.MockedFunction<typeof ExerciseBlock>;

describe('TrainingSessionView', () => {
  const mockOnEnd = jest.fn();
  const mockFormatTime = jest.fn();
  const mockSerieStateGetter = jest.fn();
  const mockUpdateSerieField = jest.fn();
  const mockToggleSerieDone = jest.fn();

  const mockRoutine: Routine = {
    name: 'Test Workout',
    routine_exercises: [
      {
        routine_exercise_id: 1,
        order: 1,
        sets: 3,
        exercise_id: 1,
        exercises: { name: 'Squats' },
      },
      {
        routine_exercise_id: 2,
        order: 2,
        sets: 4,
        exercise_id: 2,
        exercises: { name: 'Bench Press' },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');

    mockUseTimer.mockReturnValue({
      elapsedSeconds: 120,
      formatTime: mockFormatTime,
    });

    mockUseExerciseState.mockReturnValue({
      perExerciseState: {},
      serieStateGetter: mockSerieStateGetter,
      updateSerieField: mockUpdateSerieField,
      toggleSerieDone: mockToggleSerieDone,
    });

    mockFormatTime.mockReturnValue('02:00');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />)).not.toThrow();
  });

  it('should display routine name', () => {
    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    expect(getByText('Test Workout')).toBeTruthy();
  });

  it('should display formatted timer', () => {
    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    expect(mockFormatTime).toHaveBeenCalledWith(120);
    expect(getByText('Tiempo: 02:00')).toBeTruthy();
  });

  it('should render ExerciseBlock for each exercise', () => {
    render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    expect(MockExerciseBlock).toHaveBeenCalledTimes(2);
  });

  it('should render end training button', () => {
    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    expect(getByText('Finalizar entrenamiento')).toBeTruthy();
  });

  it('should call handleEnd when end button is pressed', async () => {
    const mockFinalizedSets = [
      { routineExerciseId: 1, serieIndex: 0, reps: 10, weight: 100, previous: false },
    ];
    mockBuildFinalizedSets.mockReturnValue(mockFinalizedSets);
    mockOnEnd.mockResolvedValue(true);

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(() => {
      expect(mockBuildFinalizedSets).toHaveBeenCalledWith(mockRoutine, {});
      expect(mockOnEnd).toHaveBeenCalledWith(mockFinalizedSets, 120);
    });
  });

  it('should show success alert when training is saved successfully', async () => {
    const mockFinalizedSets = [
      { routineExerciseId: 1, serieIndex: 0, reps: 10, weight: 100, previous: false },
    ];
    mockBuildFinalizedSets.mockReturnValue(mockFinalizedSets);
    mockOnEnd.mockResolvedValue(true);

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Entrenamiento guardado con éxito');
    });
  });

  it('should show error alert when training save fails', async () => {
    const mockFinalizedSets = [
      { routineExerciseId: 1, serieIndex: 0, reps: 10, weight: 100, previous: false },
    ];
    mockBuildFinalizedSets.mockReturnValue(mockFinalizedSets);
    mockOnEnd.mockResolvedValue(false);

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'No se pudo guardar el entrenamiento');
    });
  });

  it('should render exercises with correct props', () => {
    render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const firstCall = MockExerciseBlock.mock.calls[0][0];
    expect(firstCall.item.routine_exercise_id).toBe(1);
    expect(firstCall.serieStateGetter).toBe(mockSerieStateGetter);
    expect(firstCall.updateSerieField).toBe(mockUpdateSerieField);
    expect(firstCall.toggleSerieDone).toBe(mockToggleSerieDone);
  });

  it('should pass correct props to ExerciseBlock', () => {
    render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const firstCall = MockExerciseBlock.mock.calls[0][0];
    expect(firstCall.item).toEqual(mockRoutine.routine_exercises[0]);
    expect(firstCall.serieStateGetter).toBe(mockSerieStateGetter);
    expect(firstCall.updateSerieField).toBe(mockUpdateSerieField);
    expect(firstCall.toggleSerieDone).toBe(mockToggleSerieDone);
  });

  it('should render with empty routine exercises', () => {
    const emptyRoutine: Routine = {
      name: 'Empty Workout',
      routine_exercises: [],
    };

    const { getByText } = render(<TrainingSessionView routine={emptyRoutine} onEnd={mockOnEnd} />);

    expect(getByText('Empty Workout')).toBeTruthy();
    expect(MockExerciseBlock).not.toHaveBeenCalled();
  });

  it('should update timer display when elapsedSeconds changes', () => {
    mockUseTimer.mockReturnValue({
      elapsedSeconds: 300,
      formatTime: mockFormatTime,
    });
    mockFormatTime.mockReturnValue('05:00');

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    expect(mockFormatTime).toHaveBeenCalledWith(300);
    expect(getByText('Tiempo: 05:00')).toBeTruthy();
  });

  it('should call buildFinalizedSets with perExerciseState', async () => {
    const mockPerExerciseState = {
      1: { 0: { reps: '10', weight: '100', done: true } },
    };

    mockUseExerciseState.mockReturnValue({
      perExerciseState: mockPerExerciseState,
      serieStateGetter: mockSerieStateGetter,
      updateSerieField: mockUpdateSerieField,
      toggleSerieDone: mockToggleSerieDone,
    });

    mockBuildFinalizedSets.mockReturnValue([]);
    mockOnEnd.mockResolvedValue(true);

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(() => {
      expect(mockBuildFinalizedSets).toHaveBeenCalledWith(mockRoutine, mockPerExerciseState);
    });
  });

  it('should render with different routine name', () => {
    const differentRoutine: Routine = {
      name: 'Advanced Strength Training',
      routine_exercises: [],
    };

    const { getByText } = render(<TrainingSessionView routine={differentRoutine} onEnd={mockOnEnd} />);

    expect(getByText('Advanced Strength Training')).toBeTruthy();
  });

  it('should render multiple exercises correctly', () => {
    const multiExerciseRoutine: Routine = {
      name: 'Full Body',
      routine_exercises: [
        {
          routine_exercise_id: 10,
          order: 1,
          sets: 3,
          exercise_id: 10,
          exercises: { name: 'Deadlifts' },
        },
        {
          routine_exercise_id: 20,
          order: 2,
          sets: 3,
          exercise_id: 20,
          exercises: { name: 'Pull-ups' },
        },
        {
          routine_exercise_id: 30,
          order: 3,
          sets: 3,
          exercise_id: 30,
          exercises: { name: 'Dips' },
        },
      ],
    };

    render(<TrainingSessionView routine={multiExerciseRoutine} onEnd={mockOnEnd} />);

    expect(MockExerciseBlock).toHaveBeenCalledTimes(3);
  });

  it('should handle async onEnd correctly', async () => {
    mockBuildFinalizedSets.mockReturnValue([]);
    mockOnEnd.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(
      () => {
        expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Entrenamiento guardado con éxito');
      },
      { timeout: 2000 }
    );
  });

  it('should render end training button with correct text', () => {
    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const button = getByText('Finalizar entrenamiento');
    expect(button).toBeTruthy();
  });

  it('should render timer with correct text format', () => {
    mockFormatTime.mockReturnValue('00:30');
    mockUseTimer.mockReturnValue({
      elapsedSeconds: 30,
      formatTime: mockFormatTime,
    });

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const timerText = getByText('Tiempo: 00:30');
    expect(timerText).toBeTruthy();
  });

  it('should call onEnd with empty array when no exercises completed', async () => {
    mockBuildFinalizedSets.mockReturnValue([]);
    mockOnEnd.mockResolvedValue(true);

    const { getByText } = render(<TrainingSessionView routine={mockRoutine} onEnd={mockOnEnd} />);

    const endButton = getByText('Finalizar entrenamiento');
    fireEvent.press(endButton);

    await waitFor(() => {
      expect(mockOnEnd).toHaveBeenCalledWith([], 120);
    });
  });
});
