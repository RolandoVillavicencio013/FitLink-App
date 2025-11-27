import { fetchRoutine, endSession } from '../../src/services/trainingSessionService';
import { supabase } from '../../src/services/supabase';
import { FinalizedSet } from '../../src/components/views/TrainingSessionView';

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('trainingSessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRoutine', () => {
    it('should fetch routine successfully with exercises', async () => {
      const routineId = '123';
      const mockRoutine = {
        routine_id: 123,
        name: 'Test Routine',
        description: 'Test description',
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 1,
            sets: 3,
            exercise_id: 1,
            exercises: { name: 'Push ups' },
          },
        ],
      };

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRoutine,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await fetchRoutine(routineId);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('routine_exercises'));
      expect(mockEq).toHaveBeenCalledWith('routine_id', '123');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockRoutine,
        error: null,
      });
    });

    it('should return error when routine not found', async () => {
      const routineId = '999';
      const mockError = { message: 'Routine not found' };

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await fetchRoutine(routineId);

      expect(result).toEqual({
        data: null,
        error: mockError,
      });
    });

    it('should handle database errors', async () => {
      const routineId = '123';
      const mockError = { message: 'Database error' };

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await fetchRoutine(routineId);

      expect(result).toEqual({
        data: null,
        error: mockError,
      });
    });
  });

  describe('endSession', () => {
    const createMockFinalizedSets = (): FinalizedSet[] => [
      {
        routineExerciseId: 1,
        serieIndex: 1,
        weight: 50,
        reps: 10,
        previous: false,
      },
      {
        routineExerciseId: 1,
        serieIndex: 2,
        weight: 0,
        reps: 0,
        previous: true,
      },
    ];

    it('should successfully end training session', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };
      const mockUserRow = { user_id: 1 };
      const mockSession = { training_session_id: 100 };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockFromCalls: Record<string, jest.Mock> = {};

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockUserRow,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          mockFromCalls.users = mockSelect;
          return { select: mockSelect };
        }

        if (table === 'training_sessions') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockSession,
            error: null,
          });
          const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
          const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
          mockFromCalls.training_sessions = mockInsert;
          return { insert: mockInsert };
        }

        if (table === 'session_exercise_sets') {
          const mockInsert = jest.fn().mockResolvedValue({
            error: null,
          });
          mockFromCalls.session_exercise_sets = mockInsert;
          return { insert: mockInsert };
        }

        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(supabase.from).toHaveBeenCalledWith('training_sessions');
      expect(supabase.from).toHaveBeenCalledWith('session_exercise_sets');
      expect(result).toBe(true);
    });

    it('should return false when user authentication fails', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Auth error' },
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should return false when user is null', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
    });

    it('should return false when user row is not found', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          return { select: mockSelect };
        }
        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
    });

    it('should return false when training session creation fails', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };
      const mockUserRow = { user_id: 1 };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockUserRow,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          return { select: mockSelect };
        }

        if (table === 'training_sessions') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: null,
            error: null,
          });
          const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
          const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
          return { insert: mockInsert };
        }

        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
    });

    it('should return false when inserting exercise sets fails', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };
      const mockUserRow = { user_id: 1 };
      const mockSession = { training_session_id: 100 };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockUserRow,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          return { select: mockSelect };
        }

        if (table === 'training_sessions') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockSession,
            error: null,
          });
          const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
          const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
          return { insert: mockInsert };
        }

        if (table === 'session_exercise_sets') {
          const mockInsert = jest.fn().mockResolvedValue({
            error: { message: 'Insert failed' },
          });
          return { insert: mockInsert };
        }

        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
    });

    it('should map payload correctly with previous sets having zero weight and reps', async () => {
      const routineId = '123';
      const payload: FinalizedSet[] = [
        {
          routineExerciseId: 1,
          serieIndex: 1,
          weight: 50,
          reps: 10,
          previous: false,
        },
        {
          routineExerciseId: 1,
          serieIndex: 2,
          weight: 60,
          reps: 12,
          previous: true,
        },
      ];
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };
      const mockUserRow = { user_id: 1 };
      const mockSession = { training_session_id: 100 };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      let capturedInsertPayload: unknown;

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockUserRow,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          return { select: mockSelect };
        }

        if (table === 'training_sessions') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockSession,
            error: null,
          });
          const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
          const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
          return { insert: mockInsert };
        }

        if (table === 'session_exercise_sets') {
          const mockInsert = jest.fn().mockImplementation((data) => {
            capturedInsertPayload = data;
            return Promise.resolve({ error: null });
          });
          return { insert: mockInsert };
        }

        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(true);
      expect(capturedInsertPayload).toEqual([
        {
          training_session_id: 100,
          routine_exercise_id: 1,
          order: 1,
          weight: 50,
          reps: 10,
        },
        {
          training_session_id: 100,
          routine_exercise_id: 1,
          order: 2,
          weight: 0,
          reps: 0,
        },
      ]);
    });

    it('should handle exceptions and return false', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      (supabase.auth.getUser as jest.Mock).mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(false);
    });

    it('should insert session with correct date format', async () => {
      const routineId = '123';
      const payload = createMockFinalizedSets();
      const duration = 3600;

      const mockUser = { id: 'auth123', email: 'test@example.com' };
      const mockUserRow = { user_id: 1 };
      const mockSession = { training_session_id: 100 };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      let capturedSessionData: unknown;

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'users') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockUserRow,
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
          return { select: mockSelect };
        }

        if (table === 'training_sessions') {
          const mockSingle = jest.fn().mockResolvedValue({
            data: mockSession,
            error: null,
          });
          const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
          const mockInsert = jest.fn().mockImplementation((data) => {
            capturedSessionData = data;
            return { select: mockSelect };
          });
          return { insert: mockInsert };
        }

        if (table === 'session_exercise_sets') {
          const mockInsert = jest.fn().mockResolvedValue({ error: null });
          return { insert: mockInsert };
        }

        return {};
      });

      const result = await endSession(routineId, payload, duration);

      expect(result).toBe(true);
      expect(capturedSessionData).toEqual({
        user_id: 1,
        routine_id: '123',
        duration: 3600,
        date: expect.any(String),
      });
    });
  });
});
