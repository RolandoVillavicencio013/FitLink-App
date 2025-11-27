jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import TrainingSessionContainer from '../../src/containers/TrainingSessionContainer';
import { fetchRoutine, endSession } from '../../src/services/trainingSessionService';
import { TrainingSessionView } from '../../src/components/views/TrainingSessionView';

jest.mock('../../src/services/trainingSessionService');
jest.mock('../../src/components/views/TrainingSessionView', () => ({
  TrainingSessionView: jest.fn(() => null),
}));

const mockFetchRoutine = fetchRoutine as jest.MockedFunction<typeof fetchRoutine>;
const mockEndSession = endSession as jest.MockedFunction<typeof endSession>;
const MockTrainingSessionView = TrainingSessionView as jest.MockedFunction<typeof TrainingSessionView>;

// Helper function to create mock PostgrestSingleResponse
const createSuccessResponse = <T,>(data: T) => ({
  data,
  error: null,
  count: null,
  status: 200,
  statusText: 'OK',
});

describe('TrainingSessionContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    mockFetchRoutine.mockResolvedValue(createSuccessResponse(null));

    expect(() => render(<TrainingSessionContainer routineId="1" />)).not.toThrow();
  });

  it('should show loading indicator initially', () => {
    mockFetchRoutine.mockResolvedValue(createSuccessResponse(null));

    const { getByTestId } = render(<TrainingSessionContainer routineId="1" />);

    const loadingIndicator = getByTestId('activity-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should call fetchRoutine with correct routineId on mount', async () => {
    const routineId = '123';
    const mockData = {
      name: 'Test Routine',
      routine_exercises: [],
    };
    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockData));

    render(<TrainingSessionContainer routineId={routineId} />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalledWith(routineId);
    });
  });

  it('should render TrainingSessionView when routine is loaded successfully', async () => {
    const mockRoutine = {
      name: 'Test Routine',
      routine_exercises: [
        {
          routine_exercise_id: 1,
          order: 1,
          sets: 3,
          exercise_id: 1,
          exercises: { name: 'Exercise 1' },
        },
      ],
    };

    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockRoutine));

    render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(MockTrainingSessionView).toHaveBeenCalled();
    });

    const callProps = MockTrainingSessionView.mock.calls[0][0];
    expect(callProps.routine).toEqual(mockRoutine);
    expect(callProps.onEnd).toBeInstanceOf(Function);
  });

  it('should handle fetch error gracefully', async () => {
    mockFetchRoutine.mockResolvedValue({
      data: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: { message: 'Failed to fetch routine', details: '', hint: '', code: '' } as any,
      count: null,
      status: 400,
      statusText: 'Bad Request',
    });

    const { getByTestId } = render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalled();
    });

    const loadingIndicator = getByTestId('activity-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show loading indicator when routine is null', async () => {
    mockFetchRoutine.mockResolvedValue(createSuccessResponse(null));

    const { getByTestId } = render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalled();
    });

    const loadingIndicator = getByTestId('activity-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should call endSession with correct parameters when handleEndSession is invoked', async () => {
    const mockRoutine = {
      name: 'Test Routine',
      routine_exercises: [],
    };

    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockRoutine));
    mockEndSession.mockResolvedValue(true);

    render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(MockTrainingSessionView).toHaveBeenCalled();
    });

    const onEndCallback = MockTrainingSessionView.mock.calls[0][0].onEnd;
    const mockPayload = [
      {
        routineExerciseId: 1,
        serieIndex: 0,
        reps: 10,
        weight: 50,
        previous: false,
      },
    ];
    const mockDuration = 1800;

    await onEndCallback(mockPayload, mockDuration);

    expect(mockEndSession).toHaveBeenCalledWith('1', mockPayload, mockDuration);
  });

  it('should reload routine when routineId changes', async () => {
    const firstRoutine = {
      name: 'First Routine',
      routine_exercises: [],
    };

    const secondRoutine = {
      name: 'Second Routine',
      routine_exercises: [],
    };

    mockFetchRoutine.mockResolvedValueOnce(createSuccessResponse(firstRoutine));

    const { rerender } = render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalledWith('1');
    });

    mockFetchRoutine.mockResolvedValueOnce(createSuccessResponse(secondRoutine));

    rerender(<TrainingSessionContainer routineId="2" />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalledWith('2');
      expect(mockFetchRoutine).toHaveBeenCalledTimes(2);
    });
  });

  it('should set loading to false after routine is loaded', async () => {
    const mockRoutine = {
      name: 'Test Routine',
      routine_exercises: [],
    };

    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockRoutine));

    const { queryByTestId } = render(<TrainingSessionContainer routineId="1" />);

    await waitFor(() => {
      expect(mockFetchRoutine).toHaveBeenCalled();
    });

    await waitFor(() => {
      const loadingIndicator = queryByTestId('activity-indicator');
      expect(loadingIndicator).toBeNull();
    });
  });

  it('should render with different routine data', async () => {
    const mockRoutine = {
      name: 'Advanced Routine',
      routine_exercises: [
        {
          routine_exercise_id: 1,
          order: 1,
          sets: 4,
          exercise_id: 1,
          exercises: { name: 'Squats' },
        },
        {
          routine_exercise_id: 2,
          order: 2,
          sets: 3,
          exercise_id: 2,
          exercises: { name: 'Bench Press' },
        },
      ],
    };

    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockRoutine));

    render(<TrainingSessionContainer routineId="5" />);

    await waitFor(() => {
      expect(MockTrainingSessionView).toHaveBeenCalled();
    });

    const callProps = MockTrainingSessionView.mock.calls[0][0];
    expect(callProps.routine).toEqual(mockRoutine);
  });

  it('should pass onEnd handler that calls endSession', async () => {
    const mockRoutine = {
      name: 'Test',
      routine_exercises: [],
    };

    mockFetchRoutine.mockResolvedValue(createSuccessResponse(mockRoutine));

    render(<TrainingSessionContainer routineId="99" />);

    await waitFor(() => {
      expect(MockTrainingSessionView).toHaveBeenCalled();
    });

    const passedProps = MockTrainingSessionView.mock.calls[0][0];
    expect(passedProps.onEnd).toBeInstanceOf(Function);
  });
});
