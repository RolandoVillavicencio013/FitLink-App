jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');

jest.mock('expo-router', () => {
  const TabsScreen = jest.fn(() => null);
  const Tabs = Object.assign(
    jest.fn(({ children }) => children),
    { Screen: TabsScreen }
  );
  
  return {
    Tabs,
  };
});

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
      surface: '#ffffff',
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '../../../src/app/(tabs)/_layout';
import { Tabs } from 'expo-router';

describe('TabLayout', () => {
  const MockTabs = Tabs as unknown as jest.Mock & { Screen: jest.Mock };
  const TabsScreen = MockTabs.Screen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<TabLayout />)).not.toThrow();
  });

  it('should render Tabs component', () => {
    render(<TabLayout />);
    expect(MockTabs).toHaveBeenCalled();
  });

  it('should apply correct screenOptions to Tabs', () => {
    render(<TabLayout />);
    const callArgs = MockTabs.mock.calls[0][0];
    expect(callArgs.screenOptions).toMatchObject({
      headerShown: true,
      tabBarActiveTintColor: '#007AFF',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 0,
      },
      headerStyle: { backgroundColor: '#ffffff' },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { color: '#FFFFFF' },
      sceneStyle: { backgroundColor: '#f5f5f5' },
    });
  });

  it('should render Tabs component exactly once', () => {
    render(<TabLayout />);
    expect(MockTabs).toHaveBeenCalledTimes(1);
  });

  it('should render Tabs.Screen components', () => {
    render(<TabLayout />);
    expect(TabsScreen).toHaveBeenCalled();
  });

  it('should render history screen with correct options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'history');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'history',
      options: expect.objectContaining({
        title: 'Historial',
      }),
    });
  });

  it('should render routines screen with correct options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'routines');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'routines',
      options: expect.objectContaining({
        title: 'Entrenamiento',
      }),
    });
  });

  it('should render history screen with correct options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'history');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'history',
      options: expect.objectContaining({
        title: 'Historial',
      }),
    });
  });

  it('should render profile screen with correct options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'profile');
    expect(call).toBeDefined();
    expect(call[0]).toMatchObject({
      name: 'profile',
      options: expect.objectContaining({
        title: 'Perfil',
      }),
    });
  });

  it('should render all three Tabs.Screen components', () => {
    render(<TabLayout />);
    expect(TabsScreen).toHaveBeenCalledTimes(3);
  });

  it('should have tabBarIcon function in history screen options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'history');
    expect(call[0].options.tabBarIcon).toBeDefined();
    expect(typeof call[0].options.tabBarIcon).toBe('function');
  });

  it('should have tabBarIcon function in routines screen options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'routines');
    expect(call[0].options.tabBarIcon).toBeDefined();
    expect(typeof call[0].options.tabBarIcon).toBe('function');
  });

  it('should have tabBarIcon function in history screen options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'history');
    expect(call[0].options.tabBarIcon).toBeDefined();
    expect(typeof call[0].options.tabBarIcon).toBe('function');
  });

  it('should have tabBarIcon function in profile screen options', () => {
    render(<TabLayout />);
    const call = TabsScreen.mock.calls.find(call => call[0]?.name === 'profile');
    expect(call[0].options.tabBarIcon).toBeDefined();
    expect(typeof call[0].options.tabBarIcon).toBe('function');
  });
});
