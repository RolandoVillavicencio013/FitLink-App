import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

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

type SerieState = {
  weight?: string;
  reps?: string;
  done: boolean;
};

function Checkbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.checkbox, checked && styles.checkboxChecked]}
    >
      {checked ? (
        <FontAwesome name="check" size={16} color={theme.colors.surface} />
      ) : null}
    </Pressable>
  );
}

export function TrainingSessionView({
  routine,
  onEnd,
}: TrainingSessionViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [perExerciseState, setPerExerciseState] = useState<
    Record<string | number, Record<number, SerieState>>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateSerieField = (
    exerciseId: number | string,
    serieIndex: number,
    field: keyof SerieState,
    value: string | boolean
  ) => {
    setPerExerciseState((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] ?? {}),
        [serieIndex]: {
          ...(prev[exerciseId]?.[serieIndex] ?? { done: false }),
          [field]: value as any,
        },
      },
    }));
  };

  const toggleSerieDone = (exerciseId: number | string, serieIndex: number) => {
    setPerExerciseState((prev) => {
      const current = prev[exerciseId]?.[serieIndex] ?? { done: false };
      const nextDone = !current.done;
      return {
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] ?? {}),
          [serieIndex]: { ...current, done: nextDone },
        },
      };
    });
  };

  const handleEnd = async () => {
    const allSets: FinalizedSet[] = [];

    for (const exerciseId in perExerciseState) {
      const series = perExerciseState[exerciseId];
      for (const serieIndex in series) {
        const serie = series[serieIndex];
        const serieNum = Number(serieIndex);
        const exerciseNum = Number(exerciseId);

        if (serie.done) {
          allSets.push({
            routineExerciseId: exerciseNum,
            serieIndex: serieNum,
            reps: Number(serie.reps ?? 0),
            weight: Number(serie.weight ?? 0),
            previous: false,
          });
        } else {
          allSets.push({
            routineExerciseId: exerciseNum,
            serieIndex: serieNum,
            previous: true,
          });
        }
      }
    }

    const success = await onEnd(allSets, elapsedSeconds);

    if (success) {
      Alert.alert("Éxito", "Entrenamiento guardado con éxito");
    } else {
      Alert.alert("Error", "No se pudo guardar el entrenamiento");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.timer}>Tiempo: {formatTime(elapsedSeconds)}</Text>

      <FlatList
        data={routine.routine_exercises}
        keyExtractor={(item) => item.routine_exercise_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseBlock}>
            <Text style={styles.exerciseName}>{item.exercises.name}</Text>

            <View style={styles.headerRow}>
              <View style={styles.colSerie}>
                <Text style={styles.headerText}>Serie</Text>
              </View>
              <View style={styles.colAnterior}>
                <Text style={styles.headerText}>Anterior</Text>
              </View>
              <View style={styles.colPeso}>
                <Text style={styles.headerText}>Peso (kg)</Text>
              </View>
              <View style={styles.colReps}>
                <Text style={styles.headerText}>Reps</Text>
              </View>
              <View style={styles.colCheck}>
                <Text style={[styles.headerText, styles.center]}>Listo</Text>
              </View>
            </View>

            {Array.from({ length: item.sets }, (_, i) => i + 1).map((serie) => {
              const serieState = perExerciseState[item.routine_exercise_id]?.[
                serie
              ] ?? { done: false };

              return (
                <View key={serie}>
                  <View style={styles.row}>
                    <View style={styles.colSerie}>
                      <Text style={styles.serie}>{serie}</Text>
                    </View>

                    <View style={styles.colAnterior}>
                      <Text style={styles.previous}>75 × 8</Text>
                    </View>

                    <View style={styles.colPeso}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={serieState.weight ?? ""}
                        onChangeText={(text) =>
                          updateSerieField(
                            item.routine_exercise_id,
                            serie,
                            "weight",
                            text
                          )
                        }
                      />
                    </View>

                    <View style={styles.colReps}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={serieState.reps ?? ""}
                        onChangeText={(text) =>
                          updateSerieField(
                            item.routine_exercise_id,
                            serie,
                            "reps",
                            text
                          )
                        }
                      />
                    </View>

                    <View style={[styles.colCheck, styles.center]}>
                      <Checkbox
                        checked={serieState.done}
                        onToggle={() =>
                          toggleSerieDone(item.routine_exercise_id, serie)
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.restRow}>
                    <View style={styles.restLine} />
                    <Text style={styles.restText}>2:00</Text>
                    <View style={styles.restLine} />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      />

      <Pressable style={styles.endButton} onPress={handleEnd}>
        <Text style={styles.endButtonText}>Finalizar entrenamiento</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Roboto_500Medium",
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  timer: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  exerciseBlock: {
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  rest: {
    marginTop: 4,
    color: theme.colors.textSecondary,
  },
  setsContainer: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  label: {
    width: 70,
  },
  previous: {
    color: theme.colors.textSecondary,
  },
  inputHeader: {
    width: 60,
    textAlign: "left",
  },
  checkboxHeader: {
    width: 28,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 4,
    color: theme.colors.textSecondary,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colSerie: { flex: 1, marginRight: 8 },
  colAnterior: { flex: 2, marginRight: 8 },
  colPeso: { flex: 2, marginRight: 8 },
  colReps: { flex: 2, marginRight: 8 },
  colCheck: { flex: 1, alignItems: "center" },
  serie: { color: theme.colors.textSecondary },
  restRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  restLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.3,
  },
  restText: {
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
    fontSize: 12,
  },
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
