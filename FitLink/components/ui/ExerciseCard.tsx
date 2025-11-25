import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
}

interface ExerciseCardProps {
  exercise: Exercise | null;
  sets: number;
  index: number;
}

export const ExerciseCard: FC<ExerciseCardProps> = ({ exercise, sets, index }) => {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseNumber}>{index + 1}</Text>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>
            {exercise?.name || 'Ejercicio sin nombre'}
          </Text>
          {exercise?.description && (
            <Text style={styles.exerciseDescription}>
              {exercise.description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.exerciseDetails}>
        <Text style={styles.detailText}>Series: {sets}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginBottom: 12,
    padding: 15,
  },
  exerciseDescription: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  exerciseDetails: {
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseNumber: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    height: 30,
    lineHeight: 30,
    minWidth: 30,
    textAlign: 'center',
  },
});