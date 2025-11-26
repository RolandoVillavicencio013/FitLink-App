import { useColorScheme } from 'react-native';

jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useColorScheme', () => {
  it('should re-export useColorScheme from react-native', () => {
    const { useColorScheme: reexported } = require('../../src/components/useColorScheme');
    expect(reexported).toBeDefined();
  });

  it('should return light when react-native returns light', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { useColorScheme: reexported } = require('../../src/components/useColorScheme');
    const result = reexported();
    expect(result).toBe('light');
  });

  it('should return dark when react-native returns dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { useColorScheme: reexported } = require('../../src/components/useColorScheme');
    const result = reexported();
    expect(result).toBe('dark');
  });

  it('should return null when react-native returns null', () => {
    mockUseColorScheme.mockReturnValue(null);
    const { useColorScheme: reexported } = require('../../src/components/useColorScheme');
    const result = reexported();
    expect(result).toBeNull();
  });

  it('should return undefined when react-native returns undefined', () => {
    mockUseColorScheme.mockReturnValue(undefined);
    const { useColorScheme: reexported } = require('../../src/components/useColorScheme');
    const result = reexported();
    expect(result).toBeUndefined();
  });
});
