import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { getRoutinesByUserId } from '../services/repositories/routineRepository';

interface RoutineExercisePreview {
  exercise_id: number;
}

export interface Routine {
  routine_id: number;
  name: string;
  description: string;
  is_shared: boolean;
  created_at: string;
  user_id: string;
  estimated_time: number;
  routine_exercises: RoutineExercisePreview[];
}

export const useRoutinesContainer = () => {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrado de rutinas
  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cargar rutinas cuando la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  // Cargar rutinas del usuario actual
  async function loadRoutines() {
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('user_id')
        .eq('auth_id', user.id)
        .single();

      if (usersError || !users) {
        setLoading(false);
        return;
      }

      const { routines: data, error } = await getRoutinesByUserId(users.user_id);

      if (error) {
        console.error(error);
      } else {
        setRoutines(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Navegar a detalle de rutina
  const navigateToRoutine = (routineId: number) => {
    router.push(`/(tabs)/routines/${routineId}`);
  };

  // Navegar a agregar rutina
  const navigateToAddRoutine = () => {
    router.push('/routines/add-routine');
  };

  return {
    routines: filteredRoutines,
    loading,
    searchQuery,
    setSearchQuery,
    navigateToRoutine,
    navigateToAddRoutine,
  };
};