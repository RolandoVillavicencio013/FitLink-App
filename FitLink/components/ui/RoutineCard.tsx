import React, { FC } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface RoutineCardProps {
  name: string;
  exerciseCount: number;
  estimatedTime: number;
  onPress: () => void;
}

export const RoutineCard: FC<RoutineCardProps> = ({
  name,
  exerciseCount,
  estimatedTime,
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.exercises}>
        Cantidad de ejercicios: {exerciseCount}
      </Text>
      <Text style={styles.time}>
        Tiempo estimado: {estimatedTime} minutos
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
    padding: 15,
  },
  exercises: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});