import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";
import {
  TrainingSessionView,
  FinalizedSet,
  Routine,
} from "@/components/views/TrainingSessionView";
import { fetchRoutine, endSession } from "@/services/trainingSessionService";

interface TrainingSessionContainerProps {
  routineId: string;
}

export default function TrainingSessionContainer({
  routineId,
}: TrainingSessionContainerProps) {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutine = async () => {
      setLoading(true);
      const { data, error } = await fetchRoutine(routineId);
      if (!error) setRoutine(data as Routine);
      setLoading(false);
    };
    loadRoutine();
  }, [routineId]);

  const handleEndSession = (payload: FinalizedSet[], duration: number) =>
    endSession(routineId, payload, duration);

  if (loading || !routine) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <TrainingSessionView routine={routine} onEnd={handleEndSession} />;
}
