import React from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { RoutineCard, SearchInput } from '../ui';
import { Button } from '../ui';
import { theme } from '../../constants/theme';
import { Routine } from '../../containers/RoutinesContainer';

interface RoutinesListProps {
  routines: Routine[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoutinePress: (routineId: number) => void;
  onAddRoutine: () => void;
}

export const RoutinesList: React.FC<RoutinesListProps> = ({
  routines,
  loading,
  searchQuery,
  onSearchChange,
  onRoutinePress,
  onAddRoutine,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      <Button title="Agregar rutina" onPress={onAddRoutine} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 20,
  },
});