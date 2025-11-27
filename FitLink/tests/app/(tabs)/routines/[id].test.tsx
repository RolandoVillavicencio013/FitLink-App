jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('../../../../src/components/views/RoutineDetailView', () => ({
  RoutineDetailView: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import RoutineDetailScreen from '../../../../src/app/(tabs)/routines/[id]';
import { useLocalSearchParams } from 'expo-router';
import { RoutineDetailView } from '../../../../src/components/views/RoutineDetailView';

describe('RoutineDetailScreen', () => {
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing when id is provided', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act & Assert
    expect(() => render(<RoutineDetailScreen />)).not.toThrow();
  });

  it('should render RoutineDetailView with correct routineId', () => {
    // Arrange
    const testId = '123';
    mockUseLocalSearchParams.mockReturnValue({ id: testId });

    // Act
    render(<RoutineDetailScreen />);

    // Assert
    expect(RoutineDetailView).toHaveBeenCalled();
    const callArgs = (RoutineDetailView as jest.Mock).mock.calls[0][0];
    expect(callArgs.routineId).toBe(testId);
  });

  it('should pass routineId as string to RoutineDetailView', () => {
    // Arrange
    const testId = '456';
    mockUseLocalSearchParams.mockReturnValue({ id: testId });

    // Act
    render(<RoutineDetailScreen />);

    // Assert
    expect(RoutineDetailView).toHaveBeenCalled();
    const callArgs = (RoutineDetailView as jest.Mock).mock.calls[0][0];
    expect(callArgs.routineId).toBe('456');
  });

  it('should call useLocalSearchParams hook', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act
    render(<RoutineDetailScreen />);

    // Assert
    expect(mockUseLocalSearchParams).toHaveBeenCalled();
  });

  it('should render RoutineDetailView exactly once', () => {
    // Arrange
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });

    // Act
    render(<RoutineDetailScreen />);

    // Assert
    expect(RoutineDetailView).toHaveBeenCalledTimes(1);
  });
});
