import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../services/supabase";
import { theme } from "../../../constants/theme";
import CustomButton from "../../../components/CustomButton";
import { deleteRoutine } from "../../../services/delete-routine";

interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
}
interface RoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise | null;
}
interface RoutineDetail {
  routine_id: number;
  name: string;
  description: string;
  estimated_time: number;
  created_at: string;
  is_shared: boolean;
  routine_exercises: RoutineExercise[];
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadRoutineDetail();
  }, [id]);

  async function loadRoutineDetail() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("routines")
        .select(`
          routine_id,
          name,
          description,
          created_at,
          estimated_time,
          is_shared,
          routine_exercises (
            routine_exercise_id,
            order,
            sets,
            exercises (
              exercise_id,
              name,
              description
            )
          )
        `)
        .eq("routine_id", id)
        .single();
      if (error) {
        Alert.alert("Error", "No se pudo cargar la rutina");
        router.back();
        return;
      }
      // Ordenamos por 'order'
      if (data.routine_exercises) {
        data.routine_exercises.sort((a, b) => a.order - b.order);
      }
      const processedData: RoutineDetail = {
        ...data,
        routine_exercises:
          data.routine_exercises?.map((re: any) => ({
            routine_exercise_id: re.routine_exercise_id,
            order: re.order,
            sets: re.sets,
            exercises: re.exercises || null,
          })) || [],
      };
      setRoutine(processedData);
    } catch (err) {
      Alert.alert("Error", "Ocurrió un error inesperado");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleGoBack = () => router.back();

  const handleEdit = () => {
    Alert.alert(
      "En desarrollo",
      "La función de editar aún no está implementada"
    );
    // @ts-ignore
    router.push(`/edit-routine/${id}`);
  };

  // TODO: Considerar implementar el patrón Strategy acá
  const handleDelete = () => {
    deleteRoutine({
      routineId: id as string,
      onSuccess: () => router.back()
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró la rutina</Text>
        <CustomButton label="Volver" onPress={handleGoBack} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text style={styles.time}>{routine.estimated_time} minutos</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>
          {routine.description || "Sin descripción"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha de creación</Text>
        <Text style={styles.creationDate}>
          {routine.created_at 
            ? new Date(routine.created_at).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
            : "Sin fecha registrada"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Es compartida?</Text>
        <Text style={styles.isShared}>
          {routine.is_shared ? "Sí" : "No"}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Ejercicios ({routine.routine_exercises?.length || 0})
        </Text>
        {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
          routine.routine_exercises.map((exercise, index) => (
            <View
              key={exercise.routine_exercise_id}
              style={styles.exerciseCard}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {exercise.exercises?.name || "Ejercicio sin nombre"}
                  </Text>
                  {exercise.exercises?.description && (
                    <Text style={styles.exerciseDescription}>
                      {exercise.exercises.description}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={styles.detailText}>Series: {exercise.sets}</Text>
                {/* TODO: Agregar descansos */}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay ejercicios en esta rutina</Text>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButton label="Editar rutina" onPress={handleEdit} />
        <CustomButton label="Eliminar rutina" onPress={handleDelete} />
        <CustomButton label="Volver al listado" onPress={handleGoBack} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: theme.colors.textPrimary },
  time: { color: theme.colors.textSecondary, fontSize: 16, marginTop: 5 },
  section: { marginBottom: 25 },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  creationDate: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  isShared: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginBottom: 12,
    padding: 15,
  },
  exerciseHeader: { flexDirection: "row", gap: 12 },
  exerciseNumber: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
    height: 30,
    lineHeight: 30,
    minWidth: 30,
    textAlign: "center",
  },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
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
  detailText: { color: theme.colors.textSecondary, fontSize: 14 },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
  },
  errorText: { color: theme.colors.error, fontSize: 18, marginBottom: 20 },
  loadingText: { color: theme.colors.textSecondary, marginTop: 10 },
  buttonsContainer: { gap: 12, marginTop: 20, paddingBottom: 20 },
});
