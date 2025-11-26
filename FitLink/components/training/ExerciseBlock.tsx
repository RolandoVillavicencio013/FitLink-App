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
  exerciseBlock: { marginBottom: 24 },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerText: { color: theme.colors.textSecondary, fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  colSerie: { flex: 1, marginRight: 8 },
  colAnterior: { flex: 2, marginRight: 8 },
  colPeso: { flex: 2, marginRight: 8 },
  colReps: { flex: 2, marginRight: 8 },
  colCheck: { flex: 1, alignItems: "center" },
  serie: { color: theme.colors.textSecondary },
  previous: { color: theme.colors.textSecondary },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 4,
    color: theme.colors.textSecondary,
  },
  center: { alignItems: "center", justifyContent: "center" },
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
});
