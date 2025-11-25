import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import CustomButton from '../../../components/CustomButton';
import { Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useRoutines } from '../../../hooks/useRoutines';


// Para arrays, especificar el tipo de elementos que contiene
interface RoutineExercisePreview {
  exercise_id: number;
}

export default function RoutinesScreen() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const { routines, loading: routinesLoading, refresh } = useRoutines(userId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [userId])
  );

  if (authLoading || routinesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRoutines}
        keyExtractor={(item) => item.routine_id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/(tabs)/routines/${item.routine_id}`)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.exercises}>
              Cantidad de ejercicios: {item.routine_exercises?.length ?? 0}
            </Text>
            <Text style={styles.time}>
              Tiempo estimado: {item.estimated_time} minutos
            </Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar rutina..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        }
      />
      <CustomButton
        label="Agregar rutina"
        onPress={() => router.push('/routines/add-routine')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 10,
    borderWidth: 2,                    
    marginBottom: 10,
    padding: 15,
  },
  center: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  container: { 
    backgroundColor: theme.colors.background,
    flex: 1, 
    padding: 20
  },
  exercises: {
    color: theme.colors.textSecondary, 
    fontFamily: "Roboto_400Regular", 
    fontSize: 16, 
    marginBottom: 4
  },
  searchInput: {
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    width: '100%',
  },
  time: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16
  },
  title: { color: theme.colors.textPrimary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16, fontWeight: 'bold',
    marginBottom: 8
  }
});
