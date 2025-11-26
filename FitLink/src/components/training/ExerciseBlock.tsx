import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Checkbox } from "../ui/Checkbox";
import { theme } from "../../constants/theme";

interface RoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercise_id: number;
  exercises: { name: string };
}

interface ExerciseBlockProps {
  item: RoutineExercise;
  serieStateGetter: (
    exerciseId: number,
    serieIndex: number
  ) => { weight?: string; reps?: string; done: boolean };
  updateSerieField: (
    exerciseId: number,
    serieIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  toggleSerieDone: (exerciseId: number, serieIndex: number) => void;
}

export function ExerciseBlock({
  item,
  serieStateGetter,
  updateSerieField,
  toggleSerieDone,
}: ExerciseBlockProps) {
  return (
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
        const serieState = serieStateGetter(item.routine_exercise_id, serie);

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
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  colAnterior: { flex: 2, marginRight: 8 },
  colCheck: { alignItems: "center", flex: 1 },
  colPeso: { flex: 2, marginRight: 8 },
  colReps: { flex: 2, marginRight: 8 },
  colSerie: { flex: 1, marginRight: 8 },
  exerciseBlock: { marginBottom: 24 },
  exerciseName: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 6,
    paddingBottom: 6,
  },
  headerText: { color: theme.colors.textSecondary, fontSize: 12 },
  input: {
    borderColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  previous: { color: theme.colors.textSecondary },
  restLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  restRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 4,
  },
  restText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginHorizontal: 8,
  },
  row: { alignItems: "center", flexDirection: "row", marginBottom: 6 },
  serie: { color: theme.colors.textSecondary },
});
