jest.mock('expo-router', () => {
  const StackScreen = jest.fn(() => null);
  const Stack = Object.assign(
    jest.fn(({ children }) => children),
    { Screen: StackScreen }
  );
  
  return {
    Stack,
  };
});

jest.mock('../../../../src/constants/theme', () => ({
  theme: {
    colors: {
      surface: '#ffffff',
      textPrimary: '#000000',
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import RoutinesLayout from '../../../../src/app/(tabs)/routines/_layout';
import { Stack } from 'expo-router';

describe('RoutinesLayout', () => {
  const MockStack = Stack as unknown as jest.Mock & { Screen: jest.Mock };
  const StackScreen = MockStack.Screen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    // Act & Assert
    expect(() => render(<RoutinesLayout />)).not.toThrow();
  });

  it('should render Stack component', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    expect(MockStack).toHaveBeenCalled();
  });

  it('should apply correct screenOptions to Stack', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    const callArgs = MockStack.mock.calls[0][0];
    expect(callArgs.screenOptions).toMatchObject({
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#000000',
      headerTitleStyle: expect.objectContaining({
        color: '#000000',
        fontFamily: 'Roboto_500Medium',
      }),
      headerShadowVisible: false,
      contentStyle: { backgroundColor: '#f5f5f5' },
    });
  });

  it('should render Stack component exactly once', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    expect(MockStack).toHaveBeenCalledTimes(1);
  });

  it('should render Stack.Screen components', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    expect(StackScreen).toHaveBeenCalled();
  });

  it('should render index screen with correct options', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    const call = StackScreen.mock.calls.find(call => call[0]?.name === 'index');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'index',
      options: { headerShown: false },
    });
  });

  it('should render [id] screen with correct options', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    const call = StackScreen.mock.calls.find(call => call[0]?.name === '[id]');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: '[id]',
      options: {
        headerShown: true,
        title: 'Detalle de Rutina',
      },
    });
  });

  it('should render add-routine screen with correct options', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    const call = StackScreen.mock.calls.find(call => call[0]?.name === 'add-routine');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'add-routine',
      options: {
        headerShown: true,
        title: 'Nueva Rutina',
      },
    });
  });

  it('should render edit-routine/[id] screen with correct options', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    const call = StackScreen.mock.calls.find(call => call[0]?.name === 'edit-routine/[id]');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'edit-routine/[id]',
      options: {
        headerShown: true,
        title: 'Editar Rutina',
      },
    });
  });

  it('should render all four Stack.Screen components', () => {
    // Act
    render(<RoutinesLayout />);

    // Assert
    expect(StackScreen).toHaveBeenCalledTimes(4);
  });
});
