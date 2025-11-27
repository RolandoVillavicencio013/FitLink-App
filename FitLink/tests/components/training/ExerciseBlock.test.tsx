import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExerciseBlock } from '../../../src/components/training/ExerciseBlock';
import { Checkbox } from '../../../src/components/ui/Checkbox';

jest.mock('../../../src/components/ui/Checkbox', () => ({
  Checkbox: jest.fn(({ checked, onToggle }) => {
    const RN = jest.requireActual('react-native');
    return (
      <RN.Pressable testID="checkbox" onPress={onToggle}>
        {checked ? 'checked' : 'unchecked'}
      </RN.Pressable>
    );
  }),
}));

const MockCheckbox = Checkbox as jest.MockedFunction<typeof Checkbox>;

describe('ExerciseBlock', () => {
  const mockSerieStateGetter = jest.fn();
  const mockUpdateSerieField = jest.fn();
  const mockToggleSerieDone = jest.fn();

  const mockExercise = {
    routine_exercise_id: 1,
    order: 1,
    sets: 3,
    exercise_id: 1,
    exercises: { name: 'Squats' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSerieStateGetter.mockReturnValue({
      weight: '',
      reps: '',
      done: false,
    });
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <ExerciseBlock
          item={mockExercise}
          serieStateGetter={mockSerieStateGetter}
          updateSerieField={mockUpdateSerieField}
          toggleSerieDone={mockToggleSerieDone}
        />
      )
    ).not.toThrow();
  });

  it('should display exercise name', () => {
    const { getByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByText('Squats')).toBeTruthy();
  });

  it('should render header row with correct labels', () => {
    const { getByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByText('Serie')).toBeTruthy();
    expect(getByText('Anterior')).toBeTruthy();
    expect(getByText('Peso (kg)')).toBeTruthy();
    expect(getByText('Reps')).toBeTruthy();
    expect(getByText('Listo')).toBeTruthy();
  });

  it('should render correct number of series based on sets', () => {
    const { getByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('should call serieStateGetter for each set', () => {
    render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(mockSerieStateGetter).toHaveBeenCalledTimes(3);
    expect(mockSerieStateGetter).toHaveBeenCalledWith(1, 1);
    expect(mockSerieStateGetter).toHaveBeenCalledWith(1, 2);
    expect(mockSerieStateGetter).toHaveBeenCalledWith(1, 3);
  });

  it('should render weight input for each set', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const inputs = getAllByDisplayValue('');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('should call updateSerieField when weight input changes', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const weightInput = getAllByDisplayValue('')[0];
    fireEvent.changeText(weightInput, '100');

    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'weight', '100');
  });

  it('should call updateSerieField when reps input changes', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const repsInput = getAllByDisplayValue('')[1];
    fireEvent.changeText(repsInput, '10');

    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'reps', '10');
  });

  it('should display current weight value from state', () => {
    mockSerieStateGetter.mockImplementation((exerciseId, serieIndex) => {
      if (serieIndex === 1) {
        return { weight: '80', reps: '12', done: false };
      }
      return { weight: '', reps: '', done: false };
    });

    const { getByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByDisplayValue('80')).toBeTruthy();
  });

  it('should display current reps value from state', () => {
    mockSerieStateGetter.mockImplementation((exerciseId, serieIndex) => {
      if (serieIndex === 1) {
        return { weight: '80', reps: '12', done: false };
      }
      return { weight: '', reps: '', done: false };
    });

    const { getByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByDisplayValue('12')).toBeTruthy();
  });

  it('should render Checkbox for each set', () => {
    render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(MockCheckbox).toHaveBeenCalledTimes(3);
  });

  it('should pass correct checked state to Checkbox', () => {
    mockSerieStateGetter.mockImplementation((exerciseId, serieIndex) => {
      if (serieIndex === 1) {
        return { weight: '80', reps: '12', done: true };
      }
      return { weight: '', reps: '', done: false };
    });

    render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const firstCall = MockCheckbox.mock.calls[0][0];
    expect(firstCall.checked).toBe(true);
  });

  it('should call toggleSerieDone when checkbox is toggled', () => {
    const { getAllByTestId } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const firstCheckbox = getAllByTestId('checkbox')[0];
    fireEvent.press(firstCheckbox);

    expect(mockToggleSerieDone).toHaveBeenCalledWith(1, 1);
  });

  it('should render rest time for each set', () => {
    const { getAllByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const restTimes = getAllByText('2:00');
    expect(restTimes.length).toBe(3);
  });

  it('should render previous values (placeholder)', () => {
    const { getAllByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const previousValues = getAllByText('75 × 8');
    expect(previousValues.length).toBe(3);
  });

  it('should render with different exercise name', () => {
    const differentExercise = {
      routine_exercise_id: 2,
      order: 2,
      sets: 4,
      exercise_id: 2,
      exercises: { name: 'Bench Press' },
    };

    const { getByText } = render(
      <ExerciseBlock
        item={differentExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByText('Bench Press')).toBeTruthy();
  });

  it('should render correct number of sets for different exercise', () => {
    const differentExercise = {
      routine_exercise_id: 2,
      order: 2,
      sets: 5,
      exercise_id: 2,
      exercises: { name: 'Deadlifts' },
    };

    render(
      <ExerciseBlock
        item={differentExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(mockSerieStateGetter).toHaveBeenCalledTimes(5);
  });

  it('should use routine_exercise_id in callbacks', () => {
    const exercise = {
      routine_exercise_id: 99,
      order: 1,
      sets: 2,
      exercise_id: 1,
      exercises: { name: 'Test Exercise' },
    };

    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={exercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const weightInput = getAllByDisplayValue('')[0];
    fireEvent.changeText(weightInput, '50');

    expect(mockUpdateSerieField).toHaveBeenCalledWith(99, 1, 'weight', '50');
  });

  it('should handle multiple weight changes for different sets', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const inputs = getAllByDisplayValue('');
    
    // First set weight (index 0)
    fireEvent.changeText(inputs[0], '100');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'weight', '100');

    // Second set weight (index 2, because index 1 is reps for set 1)
    fireEvent.changeText(inputs[2], '105');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 2, 'weight', '105');
  });

  it('should handle multiple reps changes for different sets', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const inputs = getAllByDisplayValue('');
    
    // First set reps (index 1)
    fireEvent.changeText(inputs[1], '10');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'reps', '10');

    // Second set reps (index 3)
    fireEvent.changeText(inputs[3], '8');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 2, 'reps', '8');
  });

  it('should toggle multiple checkboxes independently', () => {
    const { getAllByTestId } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const checkboxes = getAllByTestId('checkbox');

    fireEvent.press(checkboxes[0]);
    expect(mockToggleSerieDone).toHaveBeenCalledWith(1, 1);

    fireEvent.press(checkboxes[1]);
    expect(mockToggleSerieDone).toHaveBeenCalledWith(1, 2);

    fireEvent.press(checkboxes[2]);
    expect(mockToggleSerieDone).toHaveBeenCalledWith(1, 3);
  });

  it('should display mixed state with some sets filled and some empty', () => {
    mockSerieStateGetter.mockImplementation((exerciseId, serieIndex) => {
      if (serieIndex === 1) {
        return { weight: '100', reps: '10', done: true };
      }
      if (serieIndex === 2) {
        return { weight: '105', reps: '', done: false };
      }
      return { weight: '', reps: '', done: false };
    });

    const { getByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByDisplayValue('100')).toBeTruthy();
    expect(getByDisplayValue('10')).toBeTruthy();
    expect(getByDisplayValue('105')).toBeTruthy();
  });

  it('should render with single set exercise', () => {
    const singleSetExercise = {
      routine_exercise_id: 3,
      order: 3,
      sets: 1,
      exercise_id: 3,
      exercises: { name: 'Plank' },
    };

    const { getByText } = render(
      <ExerciseBlock
        item={singleSetExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    expect(getByText('Plank')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(mockSerieStateGetter).toHaveBeenCalledTimes(1);
  });

  it('should handle numeric input correctly for weight', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const weightInput = getAllByDisplayValue('')[0];
    
    fireEvent.changeText(weightInput, '123.5');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'weight', '123.5');
  });

  it('should handle numeric input correctly for reps', () => {
    const { getAllByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const repsInput = getAllByDisplayValue('')[1];
    
    fireEvent.changeText(repsInput, '15');
    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'reps', '15');
  });

  it('should clear input when text is deleted', () => {
    mockSerieStateGetter.mockImplementation((exerciseId, serieIndex) => {
      if (serieIndex === 1) {
        return { weight: '100', reps: '10', done: false };
      }
      return { weight: '', reps: '', done: false };
    });

    const { getByDisplayValue } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const weightInput = getByDisplayValue('100');
    fireEvent.changeText(weightInput, '');

    expect(mockUpdateSerieField).toHaveBeenCalledWith(1, 1, 'weight', '');
  });

  it('should pass onToggle callback to Checkbox', () => {
    render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    const firstCheckboxCall = MockCheckbox.mock.calls[0][0];
    expect(typeof firstCheckboxCall.onToggle).toBe('function');
  });

  it('should maintain series numbering starting from 1', () => {
    const { getByText } = render(
      <ExerciseBlock
        item={mockExercise}
        serieStateGetter={mockSerieStateGetter}
        updateSerieField={mockUpdateSerieField}
        toggleSerieDone={mockToggleSerieDone}
      />
    );

    // Series should be 1, 2, 3 (not 0, 1, 2)
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });
});
