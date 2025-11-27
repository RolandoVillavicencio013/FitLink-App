jest.mock('expo-router', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../src/containers/AddRoutineContainer', () => ({
  useAddRoutineContainer: jest.fn(),
}));

jest.mock('../../../src/components/forms/RoutineForm', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { useNavigation } from 'expo-router';
import AddRoutineView from '../../../src/components/views/AddRoutineView';
import { useAddRoutineContainer } from '../../../src/containers/AddRoutineContainer';
import RoutineForm from '../../../src/components/forms/RoutineForm';

describe('AddRoutineView', () => {
  const mockUseNavigation = useNavigation as jest.Mock;
  const mockUseAddRoutineContainer = useAddRoutineContainer as jest.Mock;
  const mockAddListener = jest.fn();
  const mockUnsubscribe = jest.fn();

  const mockContainerData = {
    name: '',
    description: '',
    estimatedTime: '',
    isShared: false,
    searchQuery: '',
    errors: {},
    availableExercises: [],
    selectedExercisesDetails: [],
    selectedExercises: [],
    exerciseSets: {},
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
    mockUseAddRoutineContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<AddRoutineView />)).not.toThrow();
  });

  it('should call useNavigation hook', () => {
    render(<AddRoutineView />);
    expect(useNavigation).toHaveBeenCalled();
  });

  it('should call useAddRoutineContainer hook', () => {
    render(<AddRoutineView />);
    expect(useAddRoutineContainer).toHaveBeenCalled();
  });

  it('should render RoutineForm', () => {
    render(<AddRoutineView />);
    expect(RoutineForm).toHaveBeenCalled();
  });

  it('should pass submitLabel to RoutineForm', () => {
    render(<AddRoutineView />);
    const callArgs = (RoutineForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.submitLabel).toBe('Guardar rutina');
  });

  it('should pass container props to RoutineForm', () => {
    render(<AddRoutineView />);
    const callArgs = (RoutineForm as jest.Mock).mock.calls[0][0];
    expect(callArgs.name).toBe('');
    expect(callArgs.handleSubmit).toBe(mockContainerData.handleSubmit);
  });

  it('should add beforeRemove listener', () => {
    render(<AddRoutineView />);
    expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
  });

  it('should not prevent navigation when shouldBlockNavigation is false', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      data: { action: {} },
    };

    render(<AddRoutineView />);
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
    mockUseAddRoutineContainer.mockReturnValue(dataWithBlockingButNoChanges);

    render(<AddRoutineView />);
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
    mockUseAddRoutineContainer.mockReturnValue(dataWithChanges);

    render(<AddRoutineView />);
    const listener = mockAddListener.mock.calls[0][1];
    listener(mockEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
