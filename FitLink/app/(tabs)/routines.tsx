import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../services/supabase';
import { theme } from '../../constants/theme';
import CustomButton from '../../components/CustomButton';
import { Pressable } from 'react-native';

interface routine{
  routine_id: number;
  name: string;
  description: string;
  is_shared: boolean;
  created_at: string;
  user_id: string;
  estimated_time: number;
  routine_exercises: [];
}

export default function RoutinesScreen() {
  const router = useRouter();
  const [routines, setRoutines] = useState<routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutines();
  }, []);

  async function loadRoutines() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (usersError || !users) {
      console.error(userError);
      return;
    }

    const { data, error } = await supabase
    .from('routines')
    .select(`
      routine_id,
      name,
      description,
      is_shared,
      created_at,
      user_id,
      estimated_time,
      routine_exercises (
        exercise_id
      )
    `)
    .eq('user_id', users.user_id);

    if (error) {
      console.error(error);
    } else {
      setRoutines(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomButton
        label="Agregar rutina"
        onPress={() => router.push('/new-routine')}
      />
      <FlatList
        data={routines}
        keyExtractor={(item) => item.routine_id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/(tabs)/routines`)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.exercises}>
              {'Cantidad de ejercicios: ' + (item.routine_exercises?.length ?? 0)}
            </Text>
            <Text style={styles.time}>
              {'Tiempo estimado: ' + item.estimated_time + ' minutos'}
            </Text>
          </Pressable>
        )}
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
  container: { padding: 20 },
  exercises: {color: theme.colors.textSecondary, fontFamily: "Roboto_400Regular", fontSize: 16, marginBottom: 4},
  time: {color: theme.colors.textSecondary, fontFamily: "Roboto_400Regular", fontSize: 16, },
  title: { color: theme.colors.textPrimary, fontFamily: "Roboto_400Regular", fontSize: 16, fontWeight: 'bold', marginBottom: 8}
});
