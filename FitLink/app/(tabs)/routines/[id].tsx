import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RoutineDetailView } from '../../../components/views/RoutineDetailView';

// View: Solo organiza componentes, sin estilos ni lógica
export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <RoutineDetailView routineId={id} />;
}
