import { renderHook, waitFor } from '@testing-library/react-native';
import { useClientOnlyValue } from '../../src/components/useClientOnlyValue.web';

describe('useClientOnlyValue.web', () => {
  it('should return client value after effect runs', async () => {
    const serverValue = 'server';
    const clientValue = 'client';

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle number values', async () => {
    const serverValue = 100;
    const clientValue = 200;

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle object values', async () => {
    const serverValue = { name: 'server' };
    const clientValue = { name: 'client' };

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle array values', async () => {
    const serverValue = [1, 2, 3];
    const clientValue = [4, 5, 6];

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toEqual(clientValue);
    });
  });

  it('should handle boolean values', async () => {
    const serverValue = false;
    const clientValue = true;

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle null values', async () => {
    const serverValue = 'something';
    const clientValue = null;

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle undefined values', async () => {
    const serverValue = 'something';
    const clientValue = undefined;

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should update when client value changes', async () => {
    const serverValue = 'server';
    const clientValue1 = 'client1';
    const clientValue2 = 'client2';

    const { result, rerender } = renderHook(
      (props: { client: string }) => useClientOnlyValue(serverValue, props.client),
      { initialProps: { client: clientValue1 } }
    );

    await waitFor(() => {
      expect(result.current).toBe(clientValue1);
    });

    rerender({ client: clientValue2 });

    await waitFor(() => {
      expect(result.current).toBe(clientValue2);
    });
  });

  it('should handle same values for server and client', async () => {
    const value = 'same';

    const { result } = renderHook(() => useClientOnlyValue(value, value));

    await waitFor(() => {
      expect(result.current).toBe(value);
    });
  });

  it('should handle string values correctly', async () => {
    const serverValue = 'initial';
    const clientValue = 'final';

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });
  });

  it('should handle complex object values', async () => {
    const serverValue = { nested: { value: 1 }, array: [1, 2] };
    const clientValue = { nested: { value: 2 }, array: [3, 4] };

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toEqual(clientValue);
    });
  });

  it('should maintain state with same client value', async () => {
    const serverValue = 'server';
    const clientValue = 'client';

    const { result } = renderHook(() => useClientOnlyValue(serverValue, clientValue));

    await waitFor(() => {
      expect(result.current).toBe(clientValue);
    });

    expect(result.current).toBe(clientValue);
  });
});
