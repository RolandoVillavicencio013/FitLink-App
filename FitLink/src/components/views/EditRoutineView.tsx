import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditRoutineContainer } from '../../containers/EditRoutineContainer';
import RoutineForm from '../forms/RoutineForm';
import { theme } from '../../constants/theme';

interface EditRoutineViewProps {
  routineId: string;
}

export default function EditRoutineView({ routineId }: EditRoutineViewProps) {
  const container = useEditRoutineContainer({ routineId });

  if (container.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando rutina...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RoutineForm {...container} submitLabel="Guardar cambios" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 10,
  },
});
