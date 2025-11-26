// app/training/start/[id].tsx
import { useLocalSearchParams } from "expo-router";
import React from "react";
import TrainingSessionContainer from "@/src/containers/TrainingSessionContainer";

export default function TrainingStartScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TrainingSessionContainer routineId={String(id)} />;
}
