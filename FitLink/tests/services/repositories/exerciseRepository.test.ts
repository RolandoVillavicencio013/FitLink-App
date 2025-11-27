import { getAllExercises, insertRoutineExercises, deleteRoutineExercises } from '../../../src/services/repositories/exerciseRepository';
import { supabase } from '../../../src/services/supabase';

jest.mock('../../../src/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('exerciseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllExercises', () => {
    it('should fetch all exercises successfully', async () => {
      const mockExercises = [
        { exercise_id: 1, name: 'Push ups' },
        { exercise_id: 2, name: 'Squats' },
      ];

      const mockSelect = jest.fn().mockResolvedValue({
        data: mockExercises,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getAllExercises();

      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSelect).toHaveBeenCalledWith('exercise_id, name');
      expect(result).toEqual({
        exercises: mockExercises,
        error: null,
      });
    });

    it('should return error when fetching exercises fails', async () => {
      const mockError = { message: 'Database error' };

      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getAllExercises();

      expect(result).toEqual({
        exercises: null,
        error: mockError,
      });
    });

    it('should handle empty exercises list', async () => {
      const mockSelect = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const result = await getAllExercises();

      expect(result).toEqual({
        exercises: [],
        error: null,
      });
    });
  });

  describe('insertRoutineExercises', () => {
    it('should insert routine exercises successfully', async () => {
      const routineId = 1;
      const exercises = [
        { exercise_id: 1, sets: 3 },
        { exercise_id: 2, sets: 4 },
      ];

      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await insertRoutineExercises(routineId, exercises);

      expect(supabase.from).toHaveBeenCalledWith('routine_exercises');
      expect(mockInsert).toHaveBeenCalledWith([
        { routine_id: 1, exercise_id: 1, sets: 3 },
        { routine_id: 1, exercise_id: 2, sets: 4 },
      ]);
      expect(result).toEqual({ error: null });
    });

    it('should return error when inserting routine exercises fails', async () => {
      const routineId = 1;
      const exercises = [{ exercise_id: 1, sets: 3 }];
      const mockError = { message: 'Insert failed' };

      const mockInsert = jest.fn().mockResolvedValue({
        error: mockError,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await insertRoutineExercises(routineId, exercises);

      expect(result).toEqual({ error: mockError });
    });

    it('should handle empty exercises array', async () => {
      const routineId = 1;
      const exercises: Array<{ exercise_id: number; sets: number }> = [];

      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await insertRoutineExercises(routineId, exercises);

      expect(mockInsert).toHaveBeenCalledWith([]);
      expect(result).toEqual({ error: null });
    });

    it('should map exercises with correct structure', async () => {
      const routineId = 5;
      const exercises = [
        { exercise_id: 10, sets: 2 },
        { exercise_id: 20, sets: 5 },
        { exercise_id: 30, sets: 1 },
      ];

      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await insertRoutineExercises(routineId, exercises);

      expect(mockInsert).toHaveBeenCalledWith([
        { routine_id: 5, exercise_id: 10, sets: 2 },
        { routine_id: 5, exercise_id: 20, sets: 5 },
        { routine_id: 5, exercise_id: 30, sets: 1 },
      ]);
    });
  });

  describe('deleteRoutineExercises', () => {
    it('should delete routine exercises successfully', async () => {
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

      const result = await deleteRoutineExercises(routineId);

      expect(supabase.from).toHaveBeenCalledWith('routine_exercises');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('routine_id', '123');
      expect(result).toEqual({ error: null });
    });

    it('should return error when deleting routine exercises fails', async () => {
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

      const result = await deleteRoutineExercises(routineId);

      expect(result).toEqual({ error: mockError });
    });

    it('should handle deleting non-existent routine', async () => {
      const routineId = '999';

      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      const mockDelete = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      });

      const result = await deleteRoutineExercises(routineId);

      expect(mockEq).toHaveBeenCalledWith('routine_id', '999');
      expect(result).toEqual({ error: null });
    });
  });
});
