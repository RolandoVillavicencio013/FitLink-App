import { renderHook, act } from '@testing-library/react-native';
import { useExerciseState } from '../../src/hooks/useExerciseState';

describe('useExerciseState', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useExerciseState());
    
    expect(result.current.perExerciseState).toEqual({});
  });

  it('should return default state for non-existent exercise/serie', () => {
    const { result } = renderHook(() => useExerciseState());
    
    const state = result.current.serieStateGetter('exercise1', 0);
    
    expect(state).toEqual({ done: false });
  });

  it('should update serie weight field', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.weight).toBe('50');
    expect(state.done).toBe(false);
  });

  it('should update serie reps field', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'reps', '10');
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.reps).toBe('10');
    expect(state.done).toBe(false);
  });

  it('should update serie done field', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'done', true);
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.done).toBe(true);
  });

  it('should update multiple fields for the same serie', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
    });
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'reps', '10');
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.weight).toBe('50');
    expect(state.reps).toBe('10');
    expect(state.done).toBe(false);
  });

  it('should handle multiple series for the same exercise', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise1', 1, 'weight', '60');
    });
    
    const serie0 = result.current.serieStateGetter('exercise1', 0);
    const serie1 = result.current.serieStateGetter('exercise1', 1);
    
    expect(serie0.weight).toBe('50');
    expect(serie1.weight).toBe('60');
  });

  it('should handle multiple exercises', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise2', 0, 'weight', '70');
    });
    
    const ex1Serie0 = result.current.serieStateGetter('exercise1', 0);
    const ex2Serie0 = result.current.serieStateGetter('exercise2', 0);
    
    expect(ex1Serie0.weight).toBe('50');
    expect(ex2Serie0.weight).toBe('70');
  });

  it('should toggle serie done status from false to true', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.toggleSerieDone('exercise1', 0);
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.done).toBe(true);
  });

  it('should toggle serie done status from true to false', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'done', true);
    });
    
    act(() => {
      result.current.toggleSerieDone('exercise1', 0);
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.done).toBe(false);
  });

  it('should preserve other fields when toggling done', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise1', 0, 'reps', '10');
    });
    
    act(() => {
      result.current.toggleSerieDone('exercise1', 0);
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.weight).toBe('50');
    expect(state.reps).toBe('10');
    expect(state.done).toBe(true);
  });

  it('should handle numeric exercise IDs', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField(123, 0, 'weight', '40');
    });
    
    const state = result.current.serieStateGetter(123, 0);
    expect(state.weight).toBe('40');
  });

  it('should handle string exercise IDs', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('abc-123', 0, 'weight', '40');
    });
    
    const state = result.current.serieStateGetter('abc-123', 0);
    expect(state.weight).toBe('40');
  });

  it('should maintain state across multiple updates', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise1', 1, 'weight', '55');
      result.current.toggleSerieDone('exercise1', 0);
      result.current.updateSerieField('exercise2', 0, 'reps', '12');
    });
    
    expect(result.current.serieStateGetter('exercise1', 0)).toEqual({
      weight: '50',
      done: true,
    });
    expect(result.current.serieStateGetter('exercise1', 1)).toEqual({
      weight: '55',
      done: false,
    });
    expect(result.current.serieStateGetter('exercise2', 0)).toEqual({
      reps: '12',
      done: false,
    });
  });

  it('should not affect other series when updating one', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise1', 1, 'weight', '60');
    });
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '55');
    });
    
    const serie0 = result.current.serieStateGetter('exercise1', 0);
    const serie1 = result.current.serieStateGetter('exercise1', 1);
    
    expect(serie0.weight).toBe('55');
    expect(serie1.weight).toBe('60');
  });

  it('should not affect other exercises when updating one', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise2', 0, 'weight', '70');
    });
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '55');
    });
    
    const ex1Serie0 = result.current.serieStateGetter('exercise1', 0);
    const ex2Serie0 = result.current.serieStateGetter('exercise2', 0);
    
    expect(ex1Serie0.weight).toBe('55');
    expect(ex2Serie0.weight).toBe('70');
  });

  it('should reflect changes in perExerciseState object', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
    });
    
    expect(result.current.perExerciseState).toEqual({
      exercise1: {
        0: { weight: '50', done: false },
      },
    });
  });

  it('should update perExerciseState with multiple exercises and series', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', '50');
      result.current.updateSerieField('exercise1', 1, 'reps', '10');
      result.current.updateSerieField('exercise2', 0, 'weight', '70');
      result.current.toggleSerieDone('exercise1', 0);
    });
    
    expect(result.current.perExerciseState).toEqual({
      exercise1: {
        0: { weight: '50', done: true },
        1: { reps: '10', done: false },
      },
      exercise2: {
        0: { weight: '70', done: false },
      },
    });
  });

  it('should handle edge case of updating undefined field', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 0, 'weight', undefined);
    });
    
    const state = result.current.serieStateGetter('exercise1', 0);
    expect(state.weight).toBeUndefined();
    expect(state.done).toBe(false);
  });

  it('should handle high serie indices', () => {
    const { result } = renderHook(() => useExerciseState());
    
    act(() => {
      result.current.updateSerieField('exercise1', 99, 'weight', '100');
    });
    
    const state = result.current.serieStateGetter('exercise1', 99);
    expect(state.weight).toBe('100');
  });
});
