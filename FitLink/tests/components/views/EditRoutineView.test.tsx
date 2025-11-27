jest.mock('expo-router', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../src/containers/EditRoutineContainer', () => ({
  useEditRoutineContainer: jest.fn(),
}));

jest.mock('../../../src/components/forms/RoutineForm', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      background: '#f5f5f5',
      primary: '#007AFF',
      textSecondary: '#666666',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import EditRoutineView from '../../../src/components/views/EditRoutineView';
import { useEditRoutineContainer } from '../../../src/containers/EditRoutineContainer';
import RoutineForm from '../../../src/components/forms/RoutineForm';

describe('EditRoutineView', () => {
  const mockUseNavigation = useNavigation as jest.Mock;
  const mockUseEditRoutineContainer = useEditRoutineContainer as jest.Mock;
  const mockAddListener = jest.fn();
  const mockUnsubscribe = jest.fn();

  const mockContainerData = {
    name: 'Test Routine',
    description: 'Test Description',
    estimatedTime: '60',
    isShared: false,
    searchQuery: '',
    errors: {},
    availableExercises: [],
    selectedExercisesDetails: [],
    selectedExercises: [],
    exerciseSets: {},
    isLoading: false,
    shouldBlockNavigation: false,
    setIsShared: jest.fn(),
    setSearchQuery: jest.fn(),
    handleNameChange: jest.fn(),
    handleDescriptionChange: jest.fn(),
    handleEstimatedTimeChange: jest.fn(),
    addExercise: jest.fn(),
    removeExercise: jest.fn(),
    handleSetsChange: jest.fn(),
    handleSubmit: jest.fn(),
    hasChanges: jest.fn().mockReturnValue(false),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAddListener.mockReturnValue(mockUnsubscribe);
    mockUseNavigation.mockReturnValue({
      addListener: mockAddListener,
      dispatch: jest.fn(),
    });
    mockUseEditRoutineContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<EditRoutineView routineId="1" />)).not.toThrow();
  });

  it('should call useNavigation hook', () => {
    render(<EditRoutineView routineId="1" />);
    expect(useNavigation).toHaveBeenCalled();
  });

  it('should call useEditRoutineContainer with routineId', () => {
    render(<EditRoutineView routineId="123" />);
    expect(useEditRoutineContainer).toHaveBeenCalledWith({ routineId: '123' });
  });

  it('should render loading state', () => {
    const loadingData = { ...mockContainerData, isLoading: true };
    mockUseEditRoutineContainer.mockReturnValue(loadingData);
    const { getByText } = render(<EditRoutineView routineId="1" />);
    expect(getByText('Cargando rutina...')).toBeTruthy();
  });

  it('should render ActivityIndicator when loading', () => {
    const loadingData = { ...mockContainerData, isLoading: true };
    mockUseEditRoutineContainer.mockReturnValue(loadingData);
    const { UNSAFE_getByType } = render(<EditRoutineView routineId="1" />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should not render RoutineForm when loading', () => {
    const loadingData = { ...mockContainerData, isLoading: true };
    mockUseEditRoutineContainer.mockReturnValue(loadingData);
    render(<EditRoutineView routineId="1" />);
    expect(RoutineForm).not.toHaveBeenCalled();
  });

  it('should render RoutineForm when not loading', () => {
    render(<EditRoutineView routineId="1" />);
    expect(RoutineForm).toHaveBeenCalled();
  });

  it('should pass submitLabel to RoutineForm', () => {
    render(<EditRoutineView routineId="1" />);
    const callArgs = (RoutineForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.submitLabel).toBe('Guardar cambios');
  });

  it('should pass container props to RoutineForm', () => {
    render(<EditRoutineView routineId="1" />);
    const callArgs = (RoutineForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.name).toBe('Test Routine');
    expect(callArgs.handleSubmit).toBe(mockContainerData.handleSubmit);
  });

  it('should add beforeRemove listener', () => {
    render(<EditRoutineView routineId="1" />);
    expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
  });

  it('should not prevent navigation when shouldBlockNavigation is false', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      data: { action: {} },
    };

    render(<EditRoutineView routineId="1" />);
    const listener = mockAddListener.mock.calls[0][1];
    listener(mockEvent);

    expect(mockPreventDefault).not.toHaveBeenCalled();
  });

  it('should not prevent navigation when hasChanges is false', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      data: { action: {} },
    };

    const dataWithBlockingButNoChanges = {
      ...mockContainerData,
      shouldBlockNavigation: true,
      hasChanges: jest.fn().mockReturnValue(false),
    };
    mockUseEditRoutineContainer.mockReturnValue(dataWithBlockingButNoChanges);

    render(<EditRoutineView routineId="1" />);
    const listener = mockAddListener.mock.calls[0][1];
    listener(mockEvent);

    expect(mockPreventDefault).not.toHaveBeenCalled();
  });

  it('should prevent navigation when shouldBlockNavigation is true and hasChanges is true', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      data: { action: {} },
    };

    const dataWithChanges = {
      ...mockContainerData,
      shouldBlockNavigation: true,
      hasChanges: jest.fn().mockReturnValue(true),
    };
    mockUseEditRoutineContainer.mockReturnValue(dataWithChanges);

    render(<EditRoutineView routineId="1" />);
    const listener = mockAddListener.mock.calls[0][1];
    listener(mockEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
