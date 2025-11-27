import { renderHook, act, cleanup } from '@testing-library/react-native';
import { useTimer } from '../../src/hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with elapsed seconds at 0', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.elapsedSeconds).toBe(0);
  });

  it('should provide formatTime function', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime).toBeDefined();
    expect(typeof result.current.formatTime).toBe('function');
  });

  it('should increment elapsed seconds every second', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.elapsedSeconds).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedSeconds).toBe(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedSeconds).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedSeconds).toBe(3);
  });

  it('should increment elapsed seconds correctly over multiple seconds', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedSeconds).toBe(5);
  });

  it('should format time correctly for 0 seconds', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(0)).toBe('0:00');
  });

  it('should format time correctly for seconds less than 60', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(5)).toBe('0:05');
    expect(result.current.formatTime(30)).toBe('0:30');
    expect(result.current.formatTime(59)).toBe('0:59');
  });

  it('should format time correctly for exactly 60 seconds', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(60)).toBe('1:00');
  });

  it('should format time correctly for minutes and seconds', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(65)).toBe('1:05');
    expect(result.current.formatTime(90)).toBe('1:30');
    expect(result.current.formatTime(125)).toBe('2:05');
  });

  it('should format time correctly for large values', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(3600)).toBe('60:00');
    expect(result.current.formatTime(3661)).toBe('61:01');
  });

  it('should pad seconds with leading zero', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.formatTime(1)).toBe('0:01');
    expect(result.current.formatTime(61)).toBe('1:01');
    expect(result.current.formatTime(121)).toBe('2:01');
  });

  it('should continue incrementing after multiple intervals', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.elapsedSeconds).toBe(10);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedSeconds).toBe(15);
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useTimer());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should format elapsed time correctly as it increments', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.formatTime(result.current.elapsedSeconds)).toBe('0:00');

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(result.current.elapsedSeconds).toBe(30);
    expect(result.current.formatTime(result.current.elapsedSeconds)).toBe('0:30');

    act(() => {
      jest.advanceTimersByTime(35000);
    });

    expect(result.current.elapsedSeconds).toBe(65);
    expect(result.current.formatTime(result.current.elapsedSeconds)).toBe('1:05');
  });

  it('should handle rapid time advances', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(200);
      jest.advanceTimersByTime(300);
      jest.advanceTimersByTime(400);
    });

    expect(result.current.elapsedSeconds).toBe(1);
  });

  it('should maintain separate instances', () => {
    const { result: result1 } = renderHook(() => useTimer());
    const { result: result2 } = renderHook(() => useTimer());

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result1.current.elapsedSeconds).toBe(2);
    expect(result2.current.elapsedSeconds).toBe(2);
  });
});
