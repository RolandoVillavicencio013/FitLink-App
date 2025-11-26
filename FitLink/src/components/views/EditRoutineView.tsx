import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditRoutineContainer } from '../../containers/EditRoutineContainer';
import RoutineForm from '../forms/RoutineForm';
import { theme } from '../../constants/theme';

interface EditRoutineViewProps {
  routineId: string;
}

export default function EditRoutineView({ routineId }: EditRoutineViewProps) {
  const navigation = useNavigation();
  const container = useEditRoutineContainer({ routineId });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // No bloquear si ya se guardó exitosamente o no hay cambios
      if (!container.shouldBlockNavigation || !container.hasChanges()) {
        return;
      }

      e.preventDefault();

      if (Platform.OS === 'web') {
        const confirmed = window.confirm('Hay cambios sin guardar. ¿Deseas salir?');
        if (confirmed) {
          navigation.dispatch(e.data.action);
        }
      } else {
        Alert.alert(
          'Cambios sin guardar',
          '¿Deseas salir sin guardar los cambios?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Salir',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, container.shouldBlockNavigation, container.hasChanges]);

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
