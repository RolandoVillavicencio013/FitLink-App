import { useClientOnlyValue } from '../../src/components/useClientOnlyValue';

describe('useClientOnlyValue', () => {
  it('should return client value directly', () => {
    const serverValue = 'server';
    const clientValue = 'client';

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for different types', () => {
    const serverValue = 100;
    const clientValue = 200;

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for objects', () => {
    const serverValue = { name: 'server' };
    const clientValue = { name: 'client' };

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for arrays', () => {
    const serverValue = [1, 2, 3];
    const clientValue = [4, 5, 6];

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for boolean', () => {
    const serverValue = false;
    const clientValue = true;

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for null', () => {
    const serverValue = 'something';
    const clientValue = null;

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for undefined', () => {
    const serverValue = 'something';
    const clientValue = undefined;

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should handle same values for server and client', () => {
    const value = 'same';

    const result = useClientOnlyValue(value, value);

    expect(result).toBe(value);
  });

  it('should return client value for functions', () => {
    const serverValue = () => 'server';
    const clientValue = () => 'client';

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });

  it('should return client value for complex objects', () => {
    const serverValue = { nested: { value: 1 }, array: [1, 2] };
    const clientValue = { nested: { value: 2 }, array: [3, 4] };

    const result = useClientOnlyValue(serverValue, clientValue);

    expect(result).toBe(clientValue);
  });
});
