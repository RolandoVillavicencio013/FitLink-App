jest.mock('../../../../src/components/views/RoutinesView', () => ({
  RoutinesView: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import RoutinesScreen from '../../../../src/app/(tabs)/routines/index';
import { RoutinesView } from '../../../../src/components/views/RoutinesView';

describe('RoutinesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    // Act & Assert
    expect(() => render(<RoutinesScreen />)).not.toThrow();
  });

  it('should render RoutinesView component', () => {
    // Act
    render(<RoutinesScreen />);

    // Assert
    expect(RoutinesView).toHaveBeenCalled();
  });

  it('should render RoutinesView component exactly once', () => {
    // Act
    render(<RoutinesScreen />);

    // Assert
    expect(RoutinesView).toHaveBeenCalledTimes(1);
  });
});
