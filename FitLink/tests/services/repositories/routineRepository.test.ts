import {
  getRoutinesByUserId,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from '../../../src/services/repositories/routineRepository';
import { supabase } from '../../../src/services/supabase';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('routineRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoutinesByUserId', () => {
    it('should fetch routines by user id successfully', async () => {
      const userId = 1;
      const mockRoutines = [
        {
          routine_id: 1,
          name: 'Routine 1',
          description: 'Description 1',
          is_shared: false,
          created_at: '2024-01-01',
          user_id: 1,
          estimated_time: 60,
          routine_exercises: [{ exercise_id: 1 }],
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({
        data: mockRoutines,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        order: mockOrder,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getRoutinesByUserId(userId);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('routine_id'));
      expect(mockEq).toHaveBeenCalledWith('user_id', 1);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual({
        routines: mockRoutines,
        error: null,
      });
    });

    it('should return error when fetching routines fails', async () => {
      const userId = 1;
      const mockError = { message: 'Database error' };

      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        order: mockOrder,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getRoutinesByUserId(userId);

      expect(result).toEqual({
        routines: null,
        error: mockError,
      });
    });

    it('should handle empty routines list', async () => {
      const userId = 1;

      const mockOrder = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        order: mockOrder,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getRoutinesByUserId(userId);

      expect(result).toEqual({
        routines: [],
        error: null,
      });
    });
  });

  describe('getRoutineById', () => {
    it('should fetch routine by id successfully', async () => {
      const routineId = '123';
      const mockRoutine = {
        routine_id: 123,
        name: 'My Routine',
        description: 'Test routine',
        created_at: '2024-01-01',
        estimated_time: 45,
        is_shared: true,
        routine_exercises: [
          {
            routine_exercise_id: 1,
            order: 1,
            sets: 3,
            exercises: {
              exercise_id: 1,
              name: 'Push ups',
              description: 'Upper body',
            },
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

      const result = await getRoutineById(routineId);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('routine_id'));
      expect(mockEq).toHaveBeenCalledWith('routine_id', '123');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        routine: mockRoutine,
        error: null,
      });
    });

    it('should return error when routine not found', async () => {
      const routineId = '999';
      const mockError = { message: 'Not found' };

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

      const result = await getRoutineById(routineId);

      expect(result).toEqual({
        routine: null,
        error: mockError,
      });
    });
  });

  describe('createRoutine', () => {
    it('should create routine successfully', async () => {
      const userId = 1;
      const routineData = {
        name: 'New Routine',
        description: 'Test description',
        estimated_time: 60,
        is_shared: false,
      };

      const mockRoutine = {
        routine_id: 1,
        ...routineData,
        user_id: userId,
      };

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockRoutine,
        error: null,
      });

      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockInsert = jest.fn().mockReturnValue({
        select: mockSelect,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await createRoutine(userId, routineData);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockInsert).toHaveBeenCalledWith({
        ...routineData,
        user_id: userId,
      });
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({
        routine: mockRoutine,
        error: null,
      });
    });

    it('should return error when creating routine fails', async () => {
      const userId = 1;
      const routineData = {
        name: 'New Routine',
        description: 'Test description',
        estimated_time: 60,
        is_shared: false,
      };
      const mockError = { message: 'Insert failed' };

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle,
      });

      const mockInsert = jest.fn().mockReturnValue({
        select: mockSelect,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await createRoutine(userId, routineData);

      expect(result).toEqual({
        routine: null,
        error: mockError,
      });
    });
  });

  describe('updateRoutine', () => {
    it('should update routine successfully', async () => {
      const routineId = '123';
      const routineData = {
        name: 'Updated Routine',
        description: 'Updated description',
        estimated_time: 75,
        is_shared: true,
      };

      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      const mockUpdate = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      });

      const result = await updateRoutine(routineId, routineData);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockUpdate).toHaveBeenCalledWith(routineData);
      expect(mockEq).toHaveBeenCalledWith('routine_id', '123');
      expect(result).toEqual({ error: null });
    });

    it('should return error when updating routine fails', async () => {
      const routineId = '123';
      const routineData = {
        name: 'Updated Routine',
        description: 'Updated description',
        estimated_time: 75,
        is_shared: true,
      };
      const mockError = { message: 'Update failed' };

      const mockEq = jest.fn().mockResolvedValue({
        error: mockError,
      });

      const mockUpdate = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      });

      const result = await updateRoutine(routineId, routineData);

      expect(result).toEqual({ error: mockError });
    });
  });

  describe('deleteRoutine', () => {
    it('should delete routine successfully', async () => {
      const routineId = '123';

      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      });

      const result = await deleteRoutine(routineId);

      expect(supabase.from).toHaveBeenCalledWith('routines');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('routine_id', '123');
      expect(result).toEqual({ error: null });
    });

    it('should return error when deleting routine fails', async () => {
      const routineId = '123';
      const mockError = { message: 'Delete failed' };

      const mockEq = jest.fn().mockResolvedValue({
        error: mockError,
      });

      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      });

      const result = await deleteRoutine(routineId);

      expect(result).toEqual({ error: mockError });
    });
  });
});
