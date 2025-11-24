import { useState, useEffect } from 'react';
import { View, TextInput, Switch, StyleSheet, Text, FlatList,
  KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../services/supabase';
import CustomButton from '../../../components/CustomButton';
import { theme } from '../../../constants/theme';
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
  const [exerciseSets, setExerciseSets] = useState<{ [key: number]: string }>({});
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      return 0;
  });

  async function handleAddRoutine() {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "El nombre es requerido";
    if (!description.trim()) newErrors.description = "La descripción es requerida";
    if (!estimatedTime.trim() || isNaN(Number(estimatedTime))) {
      newErrors.estimatedTime = "El tiempo estimado debe ser un número";
    }
    if (selectedExercises.length === 0) {
      newErrors.exercises = "Debes seleccionar al menos un ejercicio";
    } else {
      const invalidSets = selectedExercises.some(
        (id) => !exerciseSets[id] || Number(exerciseSets[id]) <= 0
      );
      if (invalidSets) {
        newErrors.sets = "Debes ingresar el número de sets para cada ejercicio";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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

    if (error) {
      console.error(error);
      return;
    }

    if (!routineData) {
      console.error("No se devolvió routineData");
      return;
    }

    const routineId = routineData.routine_id;
    const routineExercises = selectedExercises.map((exerciseId) => ({
      routine_id: routineId,
      exercise_id: exerciseId,
      sets: Number(exerciseSets[exerciseId] || 0),
    }));

    const { error: routineExercisesError } = await supabase
      .from('routine_exercises')
      .insert(routineExercises);


    if (routineExercisesError) {
      console.error(routineExercisesError);
    } else {
      router.replace("/(tabs)/routines");
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
          onChangeText={(text) => {
            setName(text);
            if (errors.name && text.trim()) {
              setErrors((prev) => {
                const { name, ...rest } = prev;
                return rest;
              });
            }
          }}

        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Descripción de la rutina</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Descripción"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description && text.trim()) {
              setErrors((prev) => {
                const { description, ...rest } = prev;
                return rest;
              });
            }
          }}
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Tiempo estimado</Text>
        <TextInput
          style={styles.input}
          placeholder="Tiempo estimado (min)"
          keyboardType="numeric"
          inputMode="numeric"
          value={estimatedTime}
          onChangeText={(text) => {
            setEstimatedTime(text);
            if (errors.estimatedTime && text.trim() && !isNaN(Number(text))) {
              setErrors((prev) => {
                const { estimatedTime, ...rest } = prev;
                return rest;
              });
            }
          }}
        />
        {errors.estimatedTime && <Text style={styles.errorText}>{errors.estimatedTime}</Text>}

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
          style={{ minHeight: 147, maxHeight: 200 }}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.exercise_id);
            return (
              <View style={[styles.exerciseItem, isSelected && styles.exerciseSelected]}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedExercises(selectedExercises.filter(id => id !== item.exercise_id));
                      const newSets = { ...exerciseSets };
                      delete newSets[item.exercise_id];
                      setExerciseSets(newSets);
                    } else {
                      setSelectedExercises([...selectedExercises, item.exercise_id]);
                      if (errors.exercises) {
                        setErrors((prev) => {
                          const { exercises, ...rest } = prev;
                          return rest;
                        });
                      }
                    }
                  }}
                >
                  <Text style={styles.exerciseText}>{item.name}</Text>
                </Pressable>

                {isSelected && (
                  <TextInput
                    style={styles.setsInput}
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={exerciseSets[item.exercise_id] || ''}
                    onChangeText={(text) =>{
                      setExerciseSets({ ...exerciseSets, [item.exercise_id]: text });
                      if (errors.sets && Number(text) > 0) {
                        setErrors((prev) => {
                          const { sets, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                  />
                )}
              </View>
            );
          }}
        />
        {errors.exercises && (
          <Text style={styles.errorText}>{errors.exercises}</Text>
        )}
        {errors.sets && (
          <Text style={styles.errorText}>{errors.sets}</Text>
        )}


        <View style={styles.row}>
          <Text style={[styles.label, styles.share]}>Compartir</Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 10 },
  description: {minHeight: 120},
  errorText: {
    color: theme.colors.error,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 5
  },
  exerciseItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',  
    height: 40,             
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
    marginBottom: 5,
    padding: 10,
    width: '100%',
  },
  label: {
    color: theme.colors.textPrimary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginBottom: 10,
    marginRight: 10,
    marginTop: 10,
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
  setsInput: {
    borderColor: theme.colors.borderSecondary,
    borderRadius: 6,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    marginLeft: 10,
    padding: 6,
    textAlign: 'center',
    width: 60,
  },
  share: {marginRight: 18, marginTop: 0},
});