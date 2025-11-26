import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

export function Checkbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.checkbox, checked && styles.checkboxChecked]}
    >
      {checked ? (
        <FontAwesome name="check" size={16} color={theme.colors.surface} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
