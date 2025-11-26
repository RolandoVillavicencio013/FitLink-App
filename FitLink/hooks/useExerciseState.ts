import { useState } from "react";

type SerieState = { weight?: string; reps?: string; done: boolean };

export function useExerciseState() {
  const [perExerciseState, setPerExerciseState] = useState<
    Record<string | number, Record<number, SerieState>>
  >({});

  const serieStateGetter = (exerciseId: string | number, serieIndex: number) =>
    perExerciseState[exerciseId]?.[serieIndex] ?? { done: false };

  const updateSerieField = (
    exerciseId: string | number,
    serieIndex: number,
    field: keyof SerieState,
    value: string | boolean
  ) => {
    setPerExerciseState((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] ?? {}),
        [serieIndex]: {
          ...(prev[exerciseId]?.[serieIndex] ?? { done: false }),
          [field]: value as any,
        },
      },
    }));
  };

  const toggleSerieDone = (exerciseId: string | number, serieIndex: number) => {
    setPerExerciseState((prev) => {
      const current = prev[exerciseId]?.[serieIndex] ?? { done: false };
      return {
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] ?? {}),
          [serieIndex]: { ...current, done: !current.done },
        },
      };
    });
  };

  return {
    perExerciseState,
    serieStateGetter,
    updateSerieField,
    toggleSerieDone,
  };
}
