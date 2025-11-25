import { View, TextInput, Switch, StyleSheet, Text,
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
  availableExercises: Exercise[];
  selectedExercisesDetails: Exercise[];
  selectedExercises: number[];
  exerciseSets: { [key: number]: string };
  
  setIsShared: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  handleNameChange: (text: string) => void;
  handleDescriptionChange: (text: string) => void;
  handleEstimatedTimeChange: (text: string) => void;
  addExercise: (id: number) => void;
  removeExercise: (id: number) => void;
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
  availableExercises,
  selectedExercisesDetails,
  selectedExercises,
  exerciseSets,
  setIsShared,
  setSearchQuery,
  handleNameChange,
  handleDescriptionChange,
  handleEstimatedTimeChange,
  addExercise,
  removeExercise,
  handleSetsChange,
  onSubmit,
  submitLabel,
}: RoutineFormProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

        <Text style={styles.label}>Ejercicios Seleccionados ({selectedExercises.length})</Text>
        {selectedExercisesDetails.length > 0 ? (
          <View style={styles.selectedExercisesContainer}>
            {selectedExercisesDetails.map((exercise, index) => (
              <View key={exercise.exercise_id} style={styles.selectedExerciseItem}>
                <View style={styles.selectedExerciseInfo}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  <Text style={styles.selectedExerciseName}>{exercise.name}</Text>
                  <TextInput
                    style={styles.setsInput}
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={exerciseSets[exercise.exercise_id] || ''}
                    onChangeText={(text) => handleSetsChange(exercise.exercise_id, text)}
                  />
                </View>
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => removeExercise(exercise.exercise_id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No has agregado ejercicios aún</Text>
        )}
        {errors.exercises && <Text style={styles.errorText}>{errors.exercises}</Text>}
        {errors.sets && <Text style={styles.errorText}>{errors.sets}</Text>}

        <Text style={styles.label}>Agregar Ejercicios</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicio..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.availableExercisesContainer}>
          {availableExercises.length > 0 ? (
            availableExercises.map((exercise) => (
              <View key={exercise.exercise_id} style={styles.availableExerciseItem}>
                <Text style={styles.availableExerciseName}>{exercise.name}</Text>
                <Pressable 
                  style={styles.addButton}
                  onPress={() => addExercise(exercise.exercise_id)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron ejercicios' : 'Todos los ejercicios han sido agregados'}
            </Text>
          )}
        </View>

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
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  availableExerciseItem: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  availableExerciseName: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
  },
  availableExercisesContainer: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    maxHeight: 250,
    padding: 10,
  },
  container: { 
    flexGrow: 1, 
    padding: 20, 
    paddingBottom: 40,
    paddingTop: 10 
  },
  description: { minHeight: 120 },
  emptyText: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 5
  },
  exerciseNumber: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    height: 24,
    lineHeight: 24,
    minWidth: 24,
    textAlign: 'center',
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
  removeButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.error,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  removeButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
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
  selectedExerciseInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  selectedExerciseItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderLeftWidth: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 12,
  },
  selectedExerciseName: {
    color: theme.colors.textPrimary,
    flex: 1,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
  },
  selectedExercisesContainer: {
    marginBottom: 15,
  },
  setsInput: {
    borderColor: theme.colors.borderSecondary,
    borderRadius: 6,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    padding: 6,
    textAlign: 'center',
    width: 60,
  },
  share: { marginRight: 18, marginTop: 0 },
});
