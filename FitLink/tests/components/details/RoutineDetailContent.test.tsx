jest.mock('../../../src/components/ui', () => ({
  RoutineHeader: jest.fn(() => null),
  ExerciseCard: jest.fn(() => null),
  Button: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
      background: '#f5f5f5',
      error: '#ff3b30',
      textPrimary: '#000000',
      textSecondary: '#666666',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { RoutineDetailContent } from '../../../src/components/details/RoutineDetailContent';
import { RoutineHeader, ExerciseCard, Button } from '../../../src/components/ui';

describe('RoutineDetailContent', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockRoutine = {
    routine_id: 1,
    name: 'Test Routine',
    description: 'Test Description',
    estimated_time: 60,
    is_shared: true,
    created_at: '2024-01-01T12:00:00',
    routine_exercises: [
      {
        routine_exercise_id: 1,
        order: 0,
        sets: 3,
        exercises: {
          exercise_id: 1,
          name: 'Exercise 1',
          description: null,
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when loading', () => {
    it('should render without crashing', () => {
      expect(() => render(
        <RoutineDetailContent
          routine={null}
          loading={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )).not.toThrow();
    });

    it('should display loading text', () => {
      const { getByText } = render(
        <RoutineDetailContent
          routine={null}
          loading={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Cargando rutina...')).toBeTruthy();
    });

    it('should display ActivityIndicator', () => {
      const { UNSAFE_getByType } = render(
        <RoutineDetailContent
          routine={null}
          loading={true}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  describe('when routine is null', () => {
    it('should render without crashing', () => {
      expect(() => render(
        <RoutineDetailContent
          routine={null}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )).not.toThrow();
    });

    it('should display error message', () => {
      const { getByText } = render(
        <RoutineDetailContent
          routine={null}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('No se encontró la rutina')).toBeTruthy();
    });
  });

  describe('when routine is loaded', () => {
    it('should render without crashing', () => {
      expect(() => render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )).not.toThrow();
    });

    it('should render RoutineHeader with correct props', () => {
      render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(RoutineHeader).toHaveBeenCalled();
      const callArgs = (RoutineHeader as jest.Mock).mock.calls[0][0];
      expect(callArgs.name).toBe('Test Routine');
      expect(callArgs.estimatedTime).toBe(60);
    });

    it('should display routine description', () => {
      const { getByText } = render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Test Description')).toBeTruthy();
    });

    it('should display default description when null', () => {
      const routineWithoutDescription = { ...mockRoutine, description: '' };
      const { getByText } = render(
        <RoutineDetailContent
          routine={routineWithoutDescription}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Sin descripción')).toBeTruthy();
    });

    it('should display is_shared status as Sí', () => {
      const { getByText } = render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Sí')).toBeTruthy();
    });

    it('should display is_shared status as No', () => {
      const routineNotShared = { ...mockRoutine, is_shared: false };
      const { getByText } = render(
        <RoutineDetailContent
          routine={routineNotShared}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('No')).toBeTruthy();
    });

    it('should render ExerciseCard for each exercise', () => {
      render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(ExerciseCard).toHaveBeenCalledTimes(1);
    });

    it('should render ExerciseCard with correct props', () => {
      render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(ExerciseCard).toHaveBeenCalled();
      const callArgs = (ExerciseCard as jest.Mock).mock.calls[0][0];
      expect(callArgs.exercise).toEqual(mockRoutine.routine_exercises[0].exercises);
      expect(callArgs.sets).toBe(3);
      expect(callArgs.index).toBe(0);
    });

    it('should display empty text when no exercises', () => {
      const routineWithoutExercises = { ...mockRoutine, routine_exercises: [] };
      const { getByText } = render(
        <RoutineDetailContent
          routine={routineWithoutExercises}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('No hay ejercicios en esta rutina')).toBeTruthy();
    });

    it('should render edit button', () => {
      render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(Button).toHaveBeenCalled();
      const editButtonCall = (Button as jest.Mock).mock.calls.find(call => call[0].title === 'Editar rutina');
      expect(editButtonCall).toBeDefined();
      expect(editButtonCall[0].onPress).toBe(mockOnEdit);
    });

    it('should render delete button', () => {
      render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(Button).toHaveBeenCalled();
      const deleteButtonCall = (Button as jest.Mock).mock.calls.find(call => call[0].title === 'Eliminar rutina');
      expect(deleteButtonCall).toBeDefined();
      expect(deleteButtonCall[0].onPress).toBe(mockOnDelete);
    });

    it('should display exercise count', () => {
      const { getByText } = render(
        <RoutineDetailContent
          routine={mockRoutine}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Ejercicios (1)')).toBeTruthy();
    });

    it('should display zero exercises count when empty', () => {
      const routineWithoutExercises = { ...mockRoutine, routine_exercises: [] };
      const { getByText } = render(
        <RoutineDetailContent
          routine={routineWithoutExercises}
          loading={false}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(getByText('Ejercicios (0)')).toBeTruthy();
    });
  });
});
