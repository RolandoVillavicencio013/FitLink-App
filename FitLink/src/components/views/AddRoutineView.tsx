import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useAddRoutineContainer } from '../../containers/AddRoutineContainer';
import RoutineForm from '../forms/RoutineForm';
import { theme } from '../../constants/theme';

export default function AddRoutineView() {
  const navigation = useNavigation();
  const container = useAddRoutineContainer();

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

  return (
    <SafeAreaView style={styles.container}>
      <RoutineForm {...container} submitLabel="Guardar rutina" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
