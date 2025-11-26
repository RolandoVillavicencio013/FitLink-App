import React from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { RoutineCard, SearchInput } from "../ui";
import { Button } from "../ui";
import { theme } from "../../constants/theme";
import { Routine } from "../../containers/RoutinesContainer";

interface RoutinesListProps {
  routines: Routine[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoutinePress: (routineId: number) => void;
  onAddRoutine: () => void;
  onQuickStart: (routineId: number) => void;
}

export const RoutinesList: React.FC<RoutinesListProps> = ({
  routines,
  loading,
  searchQuery,
  onSearchChange,
  onRoutinePress,
  onAddRoutine,
  onQuickStart,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const rutinaDelDia = routines.length > 0 ? routines[0] : null;

  return (
    <View style={styles.container}>
      {rutinaDelDia && (
        <>
          <Text style={styles.sectionTitle}>Rutina del día</Text>
          <RoutineCard
            name={rutinaDelDia.name}
            exerciseCount={rutinaDelDia.routine_exercises?.length ?? 0}
            estimatedTime={rutinaDelDia.estimated_time}
            onPress={() => onRoutinePress(rutinaDelDia.routine_id)}
          />
          <Button
            title="Inicio rápido"
            onPress={() => onQuickStart(rutinaDelDia.routine_id)}
          />
        </>
      )}

      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Tus rutinas</Text>
        <TouchableOpacity onPress={onAddRoutine} style={{ marginBottom: 8 }}>
          <FontAwesome name="plus" size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.routine_id.toString()}
        renderItem={({ item }) => (
          <RoutineCard
            name={item.name}
            exerciseCount={item.routine_exercises?.length ?? 0}
            estimatedTime={item.estimated_time}
            onPress={() => onRoutinePress(item.routine_id)}
          />
        )}
        ListHeaderComponent={
          <SearchInput
            placeholder="Buscar rutina..."
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 230,
    justifyContent: "flex-start",
    marginBottom: 10,
    marginTop: 20,
  },
});
