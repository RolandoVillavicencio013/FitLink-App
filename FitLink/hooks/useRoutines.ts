import { useState, useEffect } from 'react';
import { getRoutinesByUserId } from '../services/repositories/routineRepository';

interface RoutineExercisePreview {
  exercise_id: number;
}

interface Routine {
  routine_id: number;
  name: string;
  description: string;
  is_shared: boolean;
  created_at: string;
  user_id: string;
  estimated_time: number;
  routine_exercises: RoutineExercisePreview[];
}

export function useRoutines(userId: number | null) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRoutines() {
    if (!userId) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { routines: data, error: err } = await getRoutinesByUserId(userId);

      if (err) {
        setError('No se pudieron cargar las rutinas');
        console.error(err);
      } else {
        setRoutines(data || []);
      }
    } catch (err) {
      setError('Error inesperado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoutines();
  }, [userId]);

  return { routines, loading, error, refresh: loadRoutines };
}
