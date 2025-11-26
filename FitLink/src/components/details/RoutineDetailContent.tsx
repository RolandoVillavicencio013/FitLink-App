import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { RoutineHeader, ExerciseCard } from '../ui';
import { Button } from '../ui';
import { theme } from '../../constants/theme';
import { RoutineDetail } from '../../containers/RoutineDetailContainer';

interface RoutineDetailContentProps {
  routine: RoutineDetail | null;
  loading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const RoutineDetailContent: React.FC<RoutineDetailContentProps> = ({
  routine,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró la rutina</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <RoutineHeader name={routine.name} estimatedTime={routine.estimated_time} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {routine.description || 'Sin descripción'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha de creación</Text>
        <Text style={styles.creationDate}>
          {routine.created_at
            ? new Date(routine.created_at).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            : 'Sin fecha registrada'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Es compartida?</Text>
        <Text style={styles.isShared}>{routine.is_shared ? 'Sí' : 'No'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Ejercicios ({routine.routine_exercises?.length || 0})
        </Text>
        {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
          routine.routine_exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.routine_exercise_id}
              exercise={exercise.exercises}
              sets={exercise.sets}
              index={index}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No hay ejercicios en esta rutina</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Editar rutina" onPress={onEdit} />
        <Button title="Eliminar rutina" onPress={onDelete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  creationDate: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 18,
    marginBottom: 20,
  },
  isShared: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});