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

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      surface: '#1E1E1E',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import TrainingLayout from '../../../src/app/training/_layout';
import { Stack } from 'expo-router';

describe('TrainingLayout', () => {
  const MockStack = Stack as unknown as jest.Mock & { Screen: jest.Mock };
  const StackScreen = MockStack.Screen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => render(<TrainingLayout />)).not.toThrow();
  });

  it('should render Stack component', () => {
    render(<TrainingLayout />);
    
    expect(MockStack).toHaveBeenCalled();
  });

  it('should render Stack.Screen with name [id]', () => {
    render(<TrainingLayout />);
    
    const call = StackScreen.mock.calls.find(call => call[0]?.name === '[id]');
    expect(call).toBeDefined();
  });

  it('should configure [id] screen with correct title', () => {
    render(<TrainingLayout />);
    
    const call = StackScreen.mock.calls.find(call => call[0]?.name === '[id]');
    expect(call[0]).toMatchObject({
      name: '[id]',
      options: expect.objectContaining({
        title: 'Entrenamiento',
      }),
    });
  });

  it('should configure [id] screen with correct header colors', () => {
    render(<TrainingLayout />);
    
    const call = StackScreen.mock.calls.find(call => call[0]?.name === '[id]');
    expect(call[0].options).toMatchObject({
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { color: '#FFFFFF' },
    });
  });

  it('should configure [id] screen with surface background color', () => {
    render(<TrainingLayout />);
    
    const call = StackScreen.mock.calls.find(call => call[0]?.name === '[id]');
    expect(call[0].options).toMatchObject({
      headerStyle: { backgroundColor: '#1E1E1E' },
    });
  });

  it('should render exactly one Stack.Screen', () => {
    render(<TrainingLayout />);
    
    expect(StackScreen).toHaveBeenCalledTimes(1);
  });
});
