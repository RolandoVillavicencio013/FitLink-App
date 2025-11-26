import { useColorScheme } from '../../src/components/useColorScheme.web';

describe('useColorScheme.web', () => {
  it('should return light', () => {
    const result = useColorScheme();
    expect(result).toBe('light');
  });

  it('should always return light', () => {
    const result1 = useColorScheme();
    const result2 = useColorScheme();
    expect(result1).toBe('light');
    expect(result2).toBe('light');
  });

  it('should not return dark', () => {
    const result = useColorScheme();
    expect(result).not.toBe('dark');
  });

  it('should not return null', () => {
    const result = useColorScheme();
    expect(result).not.toBeNull();
  });

  it('should not return undefined', () => {
    const result = useColorScheme();
    expect(result).not.toBeUndefined();
  });

  it('should return string type', () => {
    const result = useColorScheme();
    expect(typeof result).toBe('string');
  });
});
