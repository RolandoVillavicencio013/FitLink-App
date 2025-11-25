import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Alert, Platform, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { supabase } from '../../../../services/supabase';
import RoutineForm from '../../../../components/RoutineForm';
import { useRoutineForm } from '../../../../hooks/useRoutineForm';
import { theme } from '../../../../constants/theme';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [initialData, setInitialData] = useState({
    name: '',
    description: '',
    estimatedTime: '',
    isShared: false,
    selectedExercises: [] as number[],
    exerciseSets: {} as { [key: number]: string },
  });

  const formState = useRoutineForm({ initialData });

  useEffect(() => {
    if (id) loadRoutineData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSaving || !formState.hasChanges()) {
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
            { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, formState, isSaving]);

  async function loadRoutineData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('routines')
        .select(`
          name,
          description,
          estimated_time,
          is_shared,
          routine_exercises (
            exercise_id,
            sets
          )
        `)
        .eq('routine_id', id)
        .single();

      if (error) {
        Alert.alert('Error', 'No se pudo cargar la rutina');
        router.back();
        return;
      }

      if (data) {
        const loaded = {
          name: data.name,
          description: data.description,
          estimatedTime: data.estimated_time.toString(),
          isShared: data.is_shared,
          selectedExercises: data.routine_exercises.map((re: any) => re.exercise_id),
          exerciseSets: Object.fromEntries(
            data.routine_exercises.map((re: any) => [re.exercise_id, re.sets.toString()])
          ),
        };
        setInitialData(loaded);
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!formState.validate()) return;

    const formData = formState.getFormData();

    try {
      setIsSaving(true);
      
      const { error: updateError } = await supabase
        .from('routines')
        .update({
          name: formData.name,
          description: formData.description,
          estimated_time: formData.estimatedTime,
          is_shared: formData.isShared,
        })
        .eq('routine_id', id);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('routine_id', id);

      if (deleteError) throw deleteError;

      const routineExercises = formData.selectedExercises.map((exerciseId) => ({
        routine_id: Number(id),
        exercise_id: exerciseId,
        sets: formData.exerciseSets[exerciseId],
      }));

      const { error: insertError } = await supabase
        .from('routine_exercises')
        .insert(routineExercises);

      if (insertError) throw insertError;

      if (Platform.OS === 'web') {
        window.alert('Rutina actualizada exitosamente');
      } else {
        Alert.alert('Éxito', 'Rutina actualizada exitosamente');
      }

      router.back();
    } catch (error) {
      setIsSaving(false);
      console.error('Error al actualizar rutina:', error);
      if (Platform.OS === 'web') {
        window.alert('Error al actualizar la rutina');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la rutina');
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </View>
    );
  }

  return (
    <RoutineForm
      {...formState}
      onSubmit={handleUpdate}
      submitLabel="Guardar cambios"
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 10,
  },
});
