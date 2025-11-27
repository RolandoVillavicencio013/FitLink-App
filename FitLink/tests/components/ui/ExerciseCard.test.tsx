jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
      surface: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      divider: '#e0e0e0',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ExerciseCard } from '../../../src/components/ui/ExerciseCard';

describe('ExerciseCard', () => {
  const mockExercise = {
    exercise_id: 1,
    name: 'Push ups',
    description: 'Standard push ups',
  };

  it('should render without crashing', () => {
    expect(() => render(
      <ExerciseCard exercise={mockExercise} sets={3} index={0} />
    )).not.toThrow();
  });

  it('should display exercise name', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={3} index={0} />
    );
    expect(getByText('Push ups')).toBeTruthy();
  });

  it('should display exercise description when provided', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={3} index={0} />
    );
    expect(getByText('Standard push ups')).toBeTruthy();
  });

  it('should not display description when null', () => {
    const exerciseWithoutDescription = { ...mockExercise, description: null };
    const { queryByText } = render(
      <ExerciseCard exercise={exerciseWithoutDescription} sets={3} index={0} />
    );
    expect(queryByText('Standard push ups')).toBeNull();
  });

  it('should display sets count', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={3} index={0} />
    );
    expect(getByText('Series: 3')).toBeTruthy();
  });

  it('should display correct exercise number', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={3} index={0} />
    );
    expect(getByText('1')).toBeTruthy();
  });

  it('should display correct exercise number for index 5', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={3} index={5} />
    );
    expect(getByText('6')).toBeTruthy();
  });

  it('should display default name when exercise is null', () => {
    const { getByText } = render(
      <ExerciseCard exercise={null} sets={3} index={0} />
    );
    expect(getByText('Ejercicio sin nombre')).toBeTruthy();
  });

  it('should display sets when exercise is null', () => {
    const { getByText } = render(
      <ExerciseCard exercise={null} sets={5} index={0} />
    );
    expect(getByText('Series: 5')).toBeTruthy();
  });

  it('should render with different sets count', () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} sets={10} index={0} />
    );
    expect(getByText('Series: 10')).toBeTruthy();
  });

  it('should display exercise number when exercise is null', () => {
    const { getByText } = render(
      <ExerciseCard exercise={null} sets={3} index={2} />
    );
    expect(getByText('3')).toBeTruthy();
  });
});
