import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { theme } from "../../constants/theme";
import { ExerciseBlock } from "../training/ExerciseBlock";
import { useExerciseState } from "../../hooks/useExerciseState";
import { useTimer } from "../../hooks/useTimer";
import { buildFinalizedSets } from "../../utils/trainingSessionUtils";

export interface FinalizedSet {
  routineExerciseId: string | number;
  serieIndex: number;
  reps?: number;
  weight?: number;
  previous: boolean;
}

interface TrainingSessionViewProps {
  routine: any;
  onEnd: (payload: FinalizedSet[], duration: number) => Promise<boolean>;
}

export function TrainingSessionView({
  routine,
  onEnd,
}: TrainingSessionViewProps) {
  const { elapsedSeconds, formatTime } = useTimer();

  const {
    perExerciseState,
    serieStateGetter,
    updateSerieField,
    toggleSerieDone,
  } = useExerciseState();

  const handleEnd = async () => {
    const allSets = buildFinalizedSets(routine, perExerciseState);
    const success = await onEnd(allSets, elapsedSeconds);

    Alert.alert(
      success ? "Éxito" : "Error",
      success
        ? "Entrenamiento guardado con éxito"
        : "No se pudo guardar el entrenamiento"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.timer}>Tiempo: {formatTime(elapsedSeconds)}</Text>

      <FlatList
        data={routine.routine_exercises}
        keyExtractor={(item) => item.routine_exercise_id.toString()}
        renderItem={({ item }) => (
          <ExerciseBlock
            item={item}
            serieStateGetter={serieStateGetter}
            updateSerieField={updateSerieField}
            toggleSerieDone={toggleSerieDone}
          />
        )}
      />

      <Pressable style={styles.endButton} onPress={handleEnd}>
        <Text style={styles.endButtonText}>Finalizar entrenamiento</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  title: {
    fontSize: 22,
    fontFamily: "Roboto_500Medium",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  timer: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 16 },
  endButton: {
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: "100%",
  },
  endButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
