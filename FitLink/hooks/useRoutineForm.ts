import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Exercise {
  exercise_id: number;
  name: string;
}

interface UseRoutineFormProps {
  initialData?: {
    name: string;
    description: string;
    estimatedTime: string;
    isShared: boolean;
    selectedExercises: number[];
    exerciseSets: { [key: number]: string };
  };
}

export function useRoutineForm({ initialData }: UseRoutineFormProps = {}) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || '');
  const [isShared, setIsShared] = useState(initialData?.isShared || false);
  const [selectedExercises, setSelectedExercises] = useState<number[]>(
    initialData?.selectedExercises || []
  );
  const [exerciseSets, setExerciseSets] = useState<{ [key: number]: string }>(
    initialData?.exerciseSets || {}
  );
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadExercises() {
      const { data, error } = await supabase
        .from('exercises')
        .select('exercise_id, name');

      if (!error && data) {
        setExercises(data);
      }
    }
    loadExercises();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setEstimatedTime(initialData.estimatedTime);
      setIsShared(initialData.isShared);
      setSelectedExercises(initialData.selectedExercises);
      setExerciseSets(initialData.exerciseSets);
    }
  }, [initialData]);

  const filteredExercises = exercises
    .filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aSelected = selectedExercises.includes(a.exercise_id);
      const bSelected = selectedExercises.includes(b.exercise_id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name && text.trim()) {
      setErrors((prev) => {
        const { name, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (errors.description && text.trim()) {
      setErrors((prev) => {
        const { description, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEstimatedTimeChange = (text: string) => {
    setEstimatedTime(text);
    if (errors.estimatedTime && text.trim() && !isNaN(Number(text))) {
      setErrors((prev) => {
        const { estimatedTime, ...rest } = prev;
        return rest;
      });
    }
  };

  const toggleExerciseSelection = (exerciseId: number) => {
    const isSelected = selectedExercises.includes(exerciseId);
    
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
      const newSets = { ...exerciseSets };
      delete newSets[exerciseId];
      setExerciseSets(newSets);
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
      if (errors.exercises) {
        setErrors((prev) => {
          const { exercises, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSetsChange = (exerciseId: number, text: string) => {
    setExerciseSets({ ...exerciseSets, [exerciseId]: text });
    if (errors.sets && Number(text) > 0) {
      setErrors((prev) => {
        const { sets, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormData = () => ({
    name: name.trim(),
    description: description.trim(),
    estimatedTime: Number(estimatedTime),
    isShared,
    selectedExercises,
    exerciseSets: Object.fromEntries(
      Object.entries(exerciseSets).map(([k, v]) => [k, Number(v)])
    ),
  });

  const hasChanges = () => {
    if (!initialData) return true;
    
    return (
      name !== initialData.name ||
      description !== initialData.description ||
      estimatedTime !== initialData.estimatedTime ||
      isShared !== initialData.isShared ||
      JSON.stringify(selectedExercises.sort()) !== JSON.stringify(initialData.selectedExercises.sort()) ||
      JSON.stringify(exerciseSets) !== JSON.stringify(initialData.exerciseSets)
    );
  };

  return {
    name,
    description,
    estimatedTime,
    isShared,
    selectedExercises,
    exerciseSets,
    searchQuery,
    errors,
    filteredExercises,
    
    setIsShared,
    setSearchQuery,
    
    handleNameChange,
    handleDescriptionChange,
    handleEstimatedTimeChange,
    toggleExerciseSelection,
    handleSetsChange,
    
    validate,
    getFormData,
    hasChanges,
  };
}
