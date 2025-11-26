import { useState, useEffect, useRef } from 'react';
import { getAllExercises } from '../services/repositories/exerciseRepository';

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
  const initialDataRef = useRef(initialData);
  
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
      const { exercises: data, error } = await getAllExercises();

      if (!error && data) {
        setExercises(data);
      }
    }
    loadExercises();
  }, []);

  useEffect(() => {
    if (initialData) {
      if (!initialDataRef.current || 
          JSON.stringify(initialDataRef.current) !== JSON.stringify(initialData)) {
        initialDataRef.current = initialData;
        setName(initialData.name);
        setDescription(initialData.description);
        setEstimatedTime(initialData.estimatedTime);
        setIsShared(initialData.isShared);
        setSelectedExercises(initialData.selectedExercises);
        setExerciseSets(initialData.exerciseSets);
      }
    }
  }, [initialData]);

  const availableExercises = exercises
    .filter((ex) => !selectedExercises.includes(ex.exercise_id))
    .filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedExercisesDetails = selectedExercises
    .map(id => exercises.find(ex => ex.exercise_id === id))
    .filter(ex => ex !== undefined) as Exercise[];

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name && text.trim()) {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (errors.description && text.trim()) {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { description, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEstimatedTimeChange = (text: string) => {
    setEstimatedTime(text);
    if (errors.estimatedTime && text.trim() && !isNaN(Number(text))) {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { estimatedTime, ...rest } = prev;
        return rest;
      });
    }
  };

  const addExercise = (exerciseId: number) => {
    setSelectedExercises([...selectedExercises, exerciseId]);
    setExerciseSets({ ...exerciseSets, [exerciseId]: '3' });
    if (errors.exercises) {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { exercises, ...rest } = prev;
        return rest;
      });
    }
  };

  const removeExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    const newSets = { ...exerciseSets };
    delete newSets[exerciseId];
    setExerciseSets(newSets);
  };

  const handleSetsChange = (exerciseId: number, text: string) => {
    setExerciseSets({ ...exerciseSets, [exerciseId]: text });
    if (errors.sets && Number(text) > 0) {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const initial = initialDataRef.current;
    
    // Si no hay datos iniciales, verificar si el formulario tiene contenido
    if (!initial) {
      return (
        name.trim() !== '' ||
        description.trim() !== '' ||
        estimatedTime.trim() !== '' ||
        selectedExercises.length > 0
      );
    }
    
    return (
      name !== initial.name ||
      description !== initial.description ||
      estimatedTime !== initial.estimatedTime ||
      isShared !== initial.isShared ||
      JSON.stringify(selectedExercises.sort()) !== JSON.stringify(initial.selectedExercises.sort()) ||
      JSON.stringify(exerciseSets) !== JSON.stringify(initial.exerciseSets)
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
    availableExercises,
    selectedExercisesDetails,
    
    setIsShared,
    setSearchQuery,
    
    handleNameChange,
    handleDescriptionChange,
    handleEstimatedTimeChange,
    addExercise,
    removeExercise,
    handleSetsChange,
    
    validate,
    getFormData,
    hasChanges,
  };
}
