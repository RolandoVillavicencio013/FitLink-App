jest.mock('../../../../src/components/views/AddRoutineView', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import AddRoutineScreen from '../../../../src/app/(tabs)/routines/add-routine';
import AddRoutineView from '../../../../src/components/views/AddRoutineView';

describe('AddRoutineScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    // Act & Assert
    expect(() => render(<AddRoutineScreen />)).not.toThrow();
  });

  it('should render AddRoutineView component', () => {
    // Act
    render(<AddRoutineScreen />);

    // Assert
    expect(AddRoutineView).toHaveBeenCalled();
  });

  it('should render AddRoutineView component exactly once', () => {
    // Act
    render(<AddRoutineScreen />);

    // Assert
    expect(AddRoutineView).toHaveBeenCalledTimes(1);
  });
});
