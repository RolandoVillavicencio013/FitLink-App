import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useAddRoutineContainer } from '../../containers/AddRoutineContainer';
import RoutineForm from '../forms/RoutineForm';
import { theme } from '../../constants/theme';

export default function AddRoutineView() {
  const container = useAddRoutineContainer();

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
