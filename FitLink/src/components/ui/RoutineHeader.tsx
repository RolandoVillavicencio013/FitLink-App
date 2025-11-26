import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface RoutineHeaderProps {
  name: string;
  estimatedTime: number;
}

export const RoutineHeader: FC<RoutineHeaderProps> = ({ name, estimatedTime }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.time}>{estimatedTime} minutos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: 5,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
});