import { Stack } from "expo-router";
import { theme } from "../../constants/theme";

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Entrenamiento",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
        }}
      />
    </Stack>
  );
}
