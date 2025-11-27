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

jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

jest.mock('@expo-google-fonts/roboto', () => ({
  Roboto_400Regular: 'Roboto_400Regular',
  Roboto_500Medium: 'Roboto_500Medium',
  Roboto_700Bold: 'Roboto_700Bold',
}));

jest.mock('../../src/constants/theme', () => ({
  theme: {
    colors: {
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import RootLayout from '../../src/app/_layout';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

describe('RootLayout', () => {
  const mockUseFonts = useFonts as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when fonts are not loaded', () => {
    beforeEach(() => {
      mockUseFonts.mockReturnValue([false]);
    });

    it('should render without crashing', () => {
      expect(() => render(<RootLayout />)).not.toThrow();
    });

    it('should display ActivityIndicator', () => {
      const { UNSAFE_getByType } = render(<RootLayout />);
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should not render Stack', () => {
      render(<RootLayout />);
      expect(Stack).not.toHaveBeenCalled();
    });
  });

  describe('when fonts are loaded', () => {
    const MockStack = Stack as unknown as jest.Mock & { Screen: jest.Mock };
    const StackScreen = MockStack.Screen;

    beforeEach(() => {
      mockUseFonts.mockReturnValue([true]);
    });

    it('should render without crashing', () => {
      expect(() => render(<RootLayout />)).not.toThrow();
    });

    it('should render Stack component', () => {
      render(<RootLayout />);
      expect(MockStack).toHaveBeenCalled();
    });

    it('should apply correct screenOptions to Stack', () => {
      render(<RootLayout />);
      const callArgs = MockStack.mock.calls[0][0];
      expect(callArgs.screenOptions).toMatchObject({
        headerShown: false,
        contentStyle: { backgroundColor: '#f5f5f5' },
      });
    });

    it('should render Stack.Screen components', () => {
      render(<RootLayout />);
      expect(StackScreen).toHaveBeenCalled();
    });

    it('should render login screen', () => {
      render(<RootLayout />);
      const call = StackScreen.mock.calls.find(call => call[0]?.name === 'login');
      expect(call).toBeDefined();
      expect(call[0].name).toBe('login');
    });

    it('should render register screen', () => {
      render(<RootLayout />);
      const call = StackScreen.mock.calls.find(call => call[0]?.name === 'register');
      expect(call).toBeDefined();
      expect(call[0].name).toBe('register');
    });

    it('should render (tabs) screen', () => {
      render(<RootLayout />);
      const call = StackScreen.mock.calls.find(call => call[0]?.name === '(tabs)');
      expect(call).toBeDefined();
      expect(call[0].name).toBe('(tabs)');
    });

    it('should render all three Stack.Screen components', () => {
      render(<RootLayout />);
      expect(StackScreen).toHaveBeenCalledTimes(3);
    });

    it('should call useFonts with correct font families', () => {
      render(<RootLayout />);
      expect(mockUseFonts).toHaveBeenCalledWith({
        Roboto_400Regular: 'Roboto_400Regular',
        Roboto_500Medium: 'Roboto_500Medium',
        Roboto_700Bold: 'Roboto_700Bold',
      });
    });
  });
});
