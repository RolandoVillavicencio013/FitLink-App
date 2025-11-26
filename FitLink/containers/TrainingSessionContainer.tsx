// containers/TrainingSessionContainer.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";
import {
  TrainingSessionView,
  FinalizedSet,
} from "@/components/views/TrainingSessionView";
import { supabase } from "../services/supabase";

interface TrainingSessionContainerProps {
  routineId: string;
}

export default function TrainingSessionContainer({
  routineId,
}: TrainingSessionContainerProps) {
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutine = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("routines")
        .select(
          `
    *,
    routine_exercises (
      routine_exercise_id,
      order,
      sets,
      exercise_id,
      exercises ( name )
    )
  `
        )
        .eq("routine_id", routineId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setRoutine(data);
      }
      setLoading(false);
    };

    fetchRoutine();
  }, [routineId]);

  const handleEndSession = async (
    payload: FinalizedSet[],
    duration: number
  ): Promise<boolean> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No se pudo obtener el usuario autenticado:", userError);
        return false;
      }

      const { data: userRow, error: usersError } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_id", user.id)
        .single();

      if (usersError || !userRow) {
        console.error("No se pudo obtener el user_id:", usersError);
        return false;
      }

      const userId = userRow.user_id;

      const { data: session, error: sessionError } = await supabase
        .from("training_sessions")
        .insert({
          user_id: userId,
          routine_id: routineId,
          duration,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError || !session) {
        console.error("Error creando sesión:", sessionError);
        return false;
      }

      const { error: setsError } = await supabase
        .from("session_exercise_sets")
        .insert(
          payload.map((set) => ({
            training_session_id: session.training_session_id,
            routine_exercise_id: set.routineExerciseId,
            order: set.serieIndex,
            weight: set.previous ? 0 : set.weight,
            reps: set.previous ? 0 : set.reps,
          }))
        );

      if (setsError) {
        console.error("Error guardando sets:", setsError);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error inesperado:", err);
      return false;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <TrainingSessionView routine={routine} onEnd={handleEndSession} />;
}
