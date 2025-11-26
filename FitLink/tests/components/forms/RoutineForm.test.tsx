jest.mock('../../../src/components/ui/Button', () => ({
  Button: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
      background: '#f5f5f5',
      surface: '#ffffff',
      error: '#ff3b30',
      textPrimary: '#000000',
      textSecondary: '#666666',
      border: '#cccccc',
      borderSecondary: '#e0e0e0',
      divider: '#e0e0e0',
    },
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from 'react-native';
import RoutineForm from '../../../src/components/forms/RoutineForm';
import { Button } from '../../../src/components/ui/Button';

describe('RoutineForm', () => {
  const mockProps = {
    name: '',
    description: '',
    estimatedTime: '',
    isShared: false,
    searchQuery: '',
    errors: {},
    availableExercises: [
      { exercise_id: 1, name: 'Exercise 1' },
      { exercise_id: 2, name: 'Exercise 2' },
    ],
    selectedExercisesDetails: [],
    selectedExercises: [],
    exerciseSets: {},
    setIsShared: jest.fn(),
    setSearchQuery: jest.fn(),
    handleNameChange: jest.fn(),
    handleDescriptionChange: jest.fn(),
    handleEstimatedTimeChange: jest.fn(),
    addExercise: jest.fn(),
    removeExercise: jest.fn(),
    handleSetsChange: jest.fn(),
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<RoutineForm {...mockProps} />)).not.toThrow();
  });

  it('should display name input', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    expect(getByPlaceholderText('Nombre')).toBeTruthy();
  });

  it('should display description input', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    expect(getByPlaceholderText('Descripción')).toBeTruthy();
  });

  it('should display estimated time input', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    expect(getByPlaceholderText('Tiempo estimado (min)')).toBeTruthy();
  });

  it('should call handleNameChange when name input changes', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    const input = getByPlaceholderText('Nombre');
    fireEvent.changeText(input, 'Test Routine');
    expect(mockProps.handleNameChange).toHaveBeenCalledWith('Test Routine');
  });

  it('should call handleDescriptionChange when description input changes', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    const input = getByPlaceholderText('Descripción');
    fireEvent.changeText(input, 'Test Description');
    expect(mockProps.handleDescriptionChange).toHaveBeenCalledWith('Test Description');
  });

  it('should call handleEstimatedTimeChange when time input changes', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    const input = getByPlaceholderText('Tiempo estimado (min)');
    fireEvent.changeText(input, '60');
    expect(mockProps.handleEstimatedTimeChange).toHaveBeenCalledWith('60');
  });

  it('should display error message for name', () => {
    const propsWithError = { ...mockProps, errors: { name: 'Name is required' } };
    const { getByText } = render(<RoutineForm {...propsWithError} />);
    expect(getByText('Name is required')).toBeTruthy();
  });

  it('should display error message for description', () => {
    const propsWithError = { ...mockProps, errors: { description: 'Description is required' } };
    const { getByText } = render(<RoutineForm {...propsWithError} />);
    expect(getByText('Description is required')).toBeTruthy();
  });

  it('should display error message for estimatedTime', () => {
    const propsWithError = { ...mockProps, errors: { estimatedTime: 'Time is required' } };
    const { getByText } = render(<RoutineForm {...propsWithError} />);
    expect(getByText('Time is required')).toBeTruthy();
  });

  it('should display error message for exercises', () => {
    const propsWithError = { ...mockProps, errors: { exercises: 'Add at least one exercise' } };
    const { getByText } = render(<RoutineForm {...propsWithError} />);
    expect(getByText('Add at least one exercise')).toBeTruthy();
  });

  it('should display error message for sets', () => {
    const propsWithError = { ...mockProps, errors: { sets: 'Sets are required' } };
    const { getByText } = render(<RoutineForm {...propsWithError} />);
    expect(getByText('Sets are required')).toBeTruthy();
  });

  it('should display search input', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    expect(getByPlaceholderText('Buscar ejercicio...')).toBeTruthy();
  });

  it('should call setSearchQuery when search input changes', () => {
    const { getByPlaceholderText } = render(<RoutineForm {...mockProps} />);
    const input = getByPlaceholderText('Buscar ejercicio...');
    fireEvent.changeText(input, 'Push');
    expect(mockProps.setSearchQuery).toHaveBeenCalledWith('Push');
  });

  it('should display available exercises', () => {
    const { getByText } = render(<RoutineForm {...mockProps} />);
    expect(getByText('Exercise 1')).toBeTruthy();
    expect(getByText('Exercise 2')).toBeTruthy();
  });

  it('should call addExercise when add button is pressed', () => {
    const { getAllByText } = render(<RoutineForm {...mockProps} />);
    const addButtons = getAllByText('+');
    fireEvent.press(addButtons[0]);
    expect(mockProps.addExercise).toHaveBeenCalledWith(1);
  });

  it('should display empty message when no available exercises', () => {
    const propsWithNoExercises = { ...mockProps, availableExercises: [] };
    const { getByText } = render(<RoutineForm {...propsWithNoExercises} />);
    expect(getByText('Todos los ejercicios han sido agregados')).toBeTruthy();
  });

  it('should display empty message when search has no results', () => {
    const propsWithNoResults = { ...mockProps, availableExercises: [], searchQuery: 'test' };
    const { getByText } = render(<RoutineForm {...propsWithNoResults} />);
    expect(getByText('No se encontraron ejercicios')).toBeTruthy();
  });

  it('should display selected exercises count', () => {
    const { getByText } = render(<RoutineForm {...mockProps} />);
    expect(getByText('Ejercicios Seleccionados (0)')).toBeTruthy();
  });

  it('should display empty message when no selected exercises', () => {
    const { getByText } = render(<RoutineForm {...mockProps} />);
    expect(getByText('No has agregado ejercicios aún')).toBeTruthy();
  });

  it('should display selected exercises', () => {
    const propsWithSelected = {
      ...mockProps,
      selectedExercises: [1],
      selectedExercisesDetails: [{ exercise_id: 1, name: 'Selected Exercise' }],
      exerciseSets: { 1: '3' },
    };
    const { getByText } = render(<RoutineForm {...propsWithSelected} />);
    expect(getByText('Selected Exercise')).toBeTruthy();
  });

  it('should call removeExercise when remove button is pressed', () => {
    const propsWithSelected = {
      ...mockProps,
      selectedExercises: [1],
      selectedExercisesDetails: [{ exercise_id: 1, name: 'Selected Exercise' }],
    };
    const { getByText } = render(<RoutineForm {...propsWithSelected} />);
    const removeButton = getByText('✕');
    fireEvent.press(removeButton);
    expect(mockProps.removeExercise).toHaveBeenCalledWith(1);
  });

  it('should call handleSetsChange when sets input changes', () => {
    const propsWithSelected = {
      ...mockProps,
      selectedExercises: [1],
      selectedExercisesDetails: [{ exercise_id: 1, name: 'Selected Exercise' }],
      exerciseSets: { 1: '' },
    };
    const { getByPlaceholderText } = render(<RoutineForm {...propsWithSelected} />);
    const setsInput = getByPlaceholderText('Sets');
    fireEvent.changeText(setsInput, '3');
    expect(mockProps.handleSetsChange).toHaveBeenCalledWith(1, '3');
  });

  it('should display switch for isShared', () => {
    const { UNSAFE_getByType } = render(<RoutineForm {...mockProps} />);
    expect(UNSAFE_getByType(Switch)).toBeTruthy();
  });

  it('should call setIsShared when switch is toggled', () => {
    const { UNSAFE_getByType } = render(<RoutineForm {...mockProps} />);
    const switchComponent = UNSAFE_getByType(Switch);
    fireEvent(switchComponent, 'onValueChange', true);
    expect(mockProps.setIsShared).toHaveBeenCalledWith(true);
  });

  it('should render submit button with default label', () => {
    render(<RoutineForm {...mockProps} />);
    expect(Button).toHaveBeenCalled();
    const callArgs = (Button as jest.Mock).mock.calls[0][0];
    expect(callArgs.title).toBe('Guardar rutina');
    expect(callArgs.onPress).toBe(mockProps.handleSubmit);
    expect(callArgs.disabled).toBe(false);
  });

  it('should render submit button with custom label', () => {
    const propsWithLabel = { ...mockProps, submitLabel: 'Custom Label' };
    render(<RoutineForm {...propsWithLabel} />);
    expect(Button).toHaveBeenCalled();
    const callArgs = (Button as jest.Mock).mock.calls[0][0];
    expect(callArgs.title).toBe('Custom Label');
  });

  it('should disable submit button when loading', () => {
    const propsWithLoading = { ...mockProps, isLoading: true };
    render(<RoutineForm {...propsWithLoading} />);
    expect(Button).toHaveBeenCalled();
    const callArgs = (Button as jest.Mock).mock.calls[0][0];
    expect(callArgs.disabled).toBe(true);
  });

  it('should display exercise number for selected exercises', () => {
    const propsWithSelected = {
      ...mockProps,
      selectedExercises: [1],
      selectedExercisesDetails: [{ exercise_id: 1, name: 'Selected Exercise' }],
    };
    const { getByText } = render(<RoutineForm {...propsWithSelected} />);
    expect(getByText('1')).toBeTruthy();
  });

  it('should render with name value', () => {
    const propsWithName = { ...mockProps, name: 'My Routine' };
    const { getByDisplayValue } = render(<RoutineForm {...propsWithName} />);
    expect(getByDisplayValue('My Routine')).toBeTruthy();
  });

  it('should render with description value', () => {
    const propsWithDescription = { ...mockProps, description: 'My Description' };
    const { getByDisplayValue } = render(<RoutineForm {...propsWithDescription} />);
    expect(getByDisplayValue('My Description')).toBeTruthy();
  });

  it('should render with estimatedTime value', () => {
    const propsWithTime = { ...mockProps, estimatedTime: '45' };
    const { getByDisplayValue } = render(<RoutineForm {...propsWithTime} />);
    expect(getByDisplayValue('45')).toBeTruthy();
  });
});
