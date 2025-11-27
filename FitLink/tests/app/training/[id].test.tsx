import React from 'react';
import { render } from '@testing-library/react-native';
import TrainingStartScreen from '../../../src/app/training/[id]';
import TrainingSessionContainer from '@/src/containers/TrainingSessionContainer';

const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@/src/containers/TrainingSessionContainer', () => {
  return jest.fn(() => null);
});

describe('TrainingStartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render TrainingSessionContainer', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });
    
    render(<TrainingStartScreen />);
    
    expect(TrainingSessionContainer).toHaveBeenCalled();
  });

  it('should pass routineId to TrainingSessionContainer', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: '123' });
    
    render(<TrainingStartScreen />);
    
    const calls = (TrainingSessionContainer as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual({ routineId: '123' });
  });

  it('should convert numeric id to string', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 456 });
    
    render(<TrainingStartScreen />);
    
    const calls = (TrainingSessionContainer as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual({ routineId: '456' });
  });

  it('should handle undefined id', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: undefined });
    
    render(<TrainingStartScreen />);
    
    const calls = (TrainingSessionContainer as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual({ routineId: 'undefined' });
  });

  it('should extract id from route params', () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'routine-789' });
    
    render(<TrainingStartScreen />);
    
    const calls = (TrainingSessionContainer as jest.Mock).mock.calls;
    expect(calls[0][0]).toEqual({ routineId: 'routine-789' });
  });
});
