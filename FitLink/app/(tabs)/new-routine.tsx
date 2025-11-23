import { useState, useEffect } from 'react';
import { View, TextInput, Switch, StyleSheet, Text, FlatList,
  KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../services/supabase';
import TabLayout from './_layout';
import CustomButton from '@/components/CustomButton';
import { theme } from '@/constants/theme';
import { Pressable } from 'react-native';

interface exercise{
  exercise_id: number;
  name: string;
}

export default function AddRoutineScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [exercises, setExercises] = useState<exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadExercises() {
      const { data, error } = await supabase
        .from('exercises')
        .select('exercise_id, name');

      if (error) {
        console.error(error);
      } else {
        setExercises(data);
      }
    }
    loadExercises();
  }, []);

  const filteredExercises = exercises
    .filter((ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = selectedExercises.includes(a.exercise_id);
      const bSelected = selectedExercises.includes(b.exercise_id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0; // mantener orden
  });

  async function handleAddRoutine() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: current_user, error:  current_user_error } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (current_user_error || !current_user) {
      console.error(current_user_error);
      return;
    }

    const { data: routineData, error } = await supabase
      .from('routines')
      .insert([
        {
          name,
          description,
          estimated_time: Number(estimatedTime),
          user_id: current_user.user_id,
          is_shared: isShared,
        },
      ])
      .select('routine_id')
      .single();

    if (error || routineData) {
      console.error(error);
      return
    }

    const routineId = routineData.routine_id;
    const routineExercises = selectedExercises.map((exerciseId) => ({
      routine_id: routineId,
      exercise_id: exerciseId,
    }));

    const { error: routineExercisesError } = await supabase
      .from('routine_exercises')
      .insert(routineExercises);

    if (routineExercisesError) {
      console.error(routineExercisesError);
    } else {
      router.back();
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginBottom: 20 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nombre de la rutina</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descripción de la rutina</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Tiempo estimado</Text>
        <TextInput
          style={styles.input}
          placeholder="Tiempo estimado (min)"
          keyboardType="numeric"
          inputMode="numeric"
          value={estimatedTime}
          onChangeText={setEstimatedTime}
        />

        <Text style={styles.label}>Ejercicios</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicio..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          nestedScrollEnabled={true}
          style={{ minHeight: 160, maxHeight: 160 }}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.exercise_id);
            return (
              <Pressable
                style={[styles.exerciseItem, isSelected && styles.exerciseSelected]}
                onPress={() => {
                  if (isSelected) {
                    setSelectedExercises(selectedExercises.filter(id => id !== item.exercise_id));
                  } else {
                    setSelectedExercises([...selectedExercises, item.exercise_id]);
                  }
                }}
              >
                <Text style={styles.exerciseText}>{item.name}</Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            );
          }}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Compartir</Text>
          <Switch
            value={isShared}
            onValueChange={setIsShared}
            trackColor={{ false: '#ccc', true: '#fff' }}
            thumbColor={Platform.OS === 'android' 
              ? (isShared ? theme.colors.primary : theme.colors.primary) 
              : '#fff'}
            ios_backgroundColor={theme.colors.border}

          />
        </View>

        <CustomButton label="Guardar rutina" onPress={() => handleAddRoutine()} />
        <TabLayout/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  checkmark: {
    color: theme.colors.primary,
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
  },
  container: { flex: 1, padding: 20 },
  description: {minHeight: 120},
  exerciseItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',  
    height: 32,             
    justifyContent: 'space-between', 
    marginBottom: 10,    
    padding: 12,
  },
  exerciseSelected: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,   
  },
  exerciseText: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
  },
  input: {
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginBottom: 22,
    padding: 10,
    width: '100%',
  },
  label: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginBottom: 10,
    marginRight: 10,
    paddingLeft: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
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
});