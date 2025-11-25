import { useLocalSearchParams } from 'expo-router';
import EditRoutineView from '../../../../components/views/EditRoutineView';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <EditRoutineView routineId={id} />;
}
