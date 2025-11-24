import { View, TextInput, Switch, StyleSheet, Text, FlatList,
  KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import CustomButton from './CustomButton';
import { theme } from '../constants/theme';

interface Exercise {
  exercise_id: number;
  name: string;
}

interface RoutineFormProps {
  name: string;
  description: string;
  estimatedTime: string;
  isShared: boolean;
  searchQuery: string;
  errors: { [key: string]: string };
  filteredExercises: Exercise[];
  selectedExercises: number[];
  exerciseSets: { [key: number]: string };
  
  setIsShared: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  handleNameChange: (text: string) => void;
  handleDescriptionChange: (text: string) => void;
  handleEstimatedTimeChange: (text: string) => void;
  toggleExerciseSelection: (id: number) => void;
  handleSetsChange: (id: number, text: string) => void;
  
  onSubmit: () => void;
  submitLabel: string;
}

export default function RoutineForm({
  name,
  description,
  estimatedTime,
  isShared,
  searchQuery,
  errors,
  filteredExercises,
  selectedExercises,
  exerciseSets,
  setIsShared,
  setSearchQuery,
  handleNameChange,
  handleDescriptionChange,
  handleEstimatedTimeChange,
  toggleExerciseSelection,
  handleSetsChange,
  onSubmit,
  submitLabel,
}: RoutineFormProps) {
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
          onChangeText={handleNameChange}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Descripción de la rutina</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Descripción"
          value={description}
          onChangeText={handleDescriptionChange}
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
          onChangeText={handleEstimatedTimeChange}
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
          scrollEnabled={false}
          style={{ minHeight: 147, maxHeight: 200 }}
          renderItem={({ item }) => {
            const isSelected = selectedExercises.includes(item.exercise_id);
            return (
              <View style={[styles.exerciseItem, isSelected && styles.exerciseSelected]}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => toggleExerciseSelection(item.exercise_id)}
                >
                  <Text style={styles.exerciseText}>{item.name}</Text>
                </Pressable>

                {isSelected && (
                  <TextInput
                    style={styles.setsInput}
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={exerciseSets[item.exercise_id] || ''}
                    onChangeText={(text) => handleSetsChange(item.exercise_id, text)}
                  />
                )}
              </View>
            );
          }}
        />
        {errors.exercises && <Text style={styles.errorText}>{errors.exercises}</Text>}
        {errors.sets && <Text style={styles.errorText}>{errors.sets}</Text>}

        <View style={styles.row}>
          <Text style={[styles.label, styles.share]}>Compartir</Text>
          <Switch
            value={isShared}
            onValueChange={setIsShared}
            trackColor={{ false: '#ccc', true: '#fff' }}
            thumbColor={Platform.OS === 'android' 
              ? theme.colors.primary 
              : '#fff'}
            ios_backgroundColor={theme.colors.border}
          />
        </View>

        <CustomButton label={submitLabel} onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 10 },
  description: { minHeight: 120 },
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
  share: { marginRight: 18, marginTop: 0 },
});
