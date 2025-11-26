jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('../../../../../src/components/views/EditRoutineView', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import EditRoutineScreen from '../../../../../src/app/(tabs)/routines/edit-routine/[id]';
import { useLocalSearchParams } from 'expo-router';
import EditRoutineView from '../../../../../src/components/views/EditRoutineView';

describe('EditRoutineScreen', () => {
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing when id is provided', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act & Assert
    expect(() => render(<EditRoutineScreen />)).not.toThrow();
  });

  it('should return null when id is not provided', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: undefined });

    // Act
    const { toJSON } = render(<EditRoutineScreen />);

    // Assert
    expect(toJSON()).toBeNull();
  });

  it('should not render EditRoutineView when id is not provided', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: undefined });

    // Act
    render(<EditRoutineScreen />);

    // Assert
    expect(EditRoutineView).not.toHaveBeenCalled();
  });

  it('should render EditRoutineView with correct routineId', () => {
    // Arrange
    const testId = '123';
    mockUseLocalSearchParams.mockReturnValue({ id: testId });

    // Act
    render(<EditRoutineScreen />);

    // Assert
    expect(EditRoutineView).toHaveBeenCalled();
    const callArgs = (EditRoutineView as jest.Mock).mock.calls[0][0];
    expect(callArgs.routineId).toBe(testId);
  });

  it('should pass routineId as string to EditRoutineView', () => {
    // Arrange
    const testId = '456';
    mockUseLocalSearchParams.mockReturnValue({ id: testId });

    // Act
    render(<EditRoutineScreen />);

    // Assert
    expect(EditRoutineView).toHaveBeenCalled();
    const callArgs = (EditRoutineView as jest.Mock).mock.calls[0][0];
    expect(callArgs.routineId).toBe('456');
  });

  it('should call useLocalSearchParams hook', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act
    render(<EditRoutineScreen />);

    // Assert
    expect(mockUseLocalSearchParams).toHaveBeenCalled();
  });

  it('should render EditRoutineView exactly once when id is provided', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act
    render(<EditRoutineScreen />);

    // Assert
    expect(EditRoutineView).toHaveBeenCalledTimes(1);
  });

  it('should return null when id is empty string', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '' });

    // Act
    const { toJSON } = render(<EditRoutineScreen />);

    // Assert
    expect(toJSON()).toBeNull();
  });

  it('should return null when id is null', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: null });

    // Act
    const { toJSON } = render(<EditRoutineScreen />);

    // Assert
    expect(toJSON()).toBeNull();
  });
});
