import { useState } from "react";

type SerieState = { weight?: string; reps?: string; done: boolean };

export function useExerciseState() {
  const [perExerciseState, setPerExerciseState] = useState<
    Record<string | number, Record<number, SerieState>>
  >({});

  const serieStateGetter = (exerciseId: string | number, serieIndex: number) =>
    perExerciseState[exerciseId]?.[serieIndex] ?? { done: false };

  const updateSerieField = <K extends keyof SerieState>(
    exerciseId: string | number,
    serieIndex: number,
    field: K,
    value: SerieState[K]
  ) => {
    setPerExerciseState((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] ?? {}),
        [serieIndex]: {
          ...(prev[exerciseId]?.[serieIndex] ?? { done: false }),
          [field]: value,
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
