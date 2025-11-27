jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      surface: '#ffffff',
      border: '#cccccc',
      textPrimary: '#000000',
      textSecondary: '#666666',
    },
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RoutineCard } from '../../../src/components/ui/RoutineCard';

describe('RoutineCard', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    )).not.toThrow();
  });

  it('should display routine name', () => {
    const { getByText } = render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Morning Routine')).toBeTruthy();
  });

  it('should display exercise count', () => {
    const { getByText } = render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Cantidad de ejercicios: 5')).toBeTruthy();
  });

  it('should display estimated time', () => {
    const { getByText } = render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Tiempo estimado: 30 minutos')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    );
    fireEvent.press(getByText('Morning Routine'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should call onPress exactly once when pressed', () => {
    const { getByText } = render(
      <RoutineCard
        name="Morning Routine"
        exerciseCount={5}
        estimatedTime={30}
        onPress={mockOnPress}
      />
    );
    fireEvent.press(getByText('Morning Routine'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display zero exercises', () => {
    const { getByText } = render(
      <RoutineCard
        name="Empty Routine"
        exerciseCount={0}
        estimatedTime={0}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Cantidad de ejercicios: 0')).toBeTruthy();
  });

  it('should display large exercise count', () => {
    const { getByText } = render(
      <RoutineCard
        name="Full Routine"
        exerciseCount={20}
        estimatedTime={120}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Cantidad de ejercicios: 20')).toBeTruthy();
  });

  it('should display large estimated time', () => {
    const { getByText } = render(
      <RoutineCard
        name="Long Routine"
        exerciseCount={10}
        estimatedTime={180}
        onPress={mockOnPress}
      />
    );
    expect(getByText('Tiempo estimado: 180 minutos')).toBeTruthy();
  });
});
